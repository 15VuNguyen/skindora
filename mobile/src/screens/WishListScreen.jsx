import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useFetch from "../hooks/common/useFetch";
import usePut from "../hooks/common/usePut";
import axiosPublic from "../utils/axiosPublic";
import LoadingScreen from "./LoadingScreen";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export default function WishlistScreen() {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selected, setSelected] = useState([]);
  const swipeableRefs = useRef({});
  const currentOpenSwipeable = useRef(null);

  const {
    data: wishlistData,
    loading: loadingIds,
    error,
  } = useFetch("/users/getWishList", true, false);

  const { put: removeFromWishlist, loading: removing } = usePut(
    "/users/removeFromWishList"
  );

  useEffect(() => {
    let isMounted = true;

    const fetchAllProductDetails = async () => {
      setLoadingProducts(true);
      try {
        const fetches = wishlistData.map((id) =>
          axiosPublic.get(`/products/${id}`)
        );
        const results = await Promise.all(fetches);
        const clean = results.map((res) => res.data?.result).filter(Boolean);
        if (isMounted) setProducts(clean);
      } catch (err) {
        console.error("Lỗi khi fetch sản phẩm:", err);
      } finally {
        setLoadingProducts(false);
        setSelected([]);
      }
    };

    if (Array.isArray(wishlistData) && wishlistData.length > 0 && !loadingIds) {
      fetchAllProductDetails();
    } else if (!loadingIds) {
      setProducts([]);
      setLoadingProducts(false);
    }

    return () => {
      isMounted = false;
    };
  }, [wishlistData, loadingIds]);

  const handlePress = (product) => {
    if (selected.length > 0) {
      toggleSelect(product._id);
    } else {
      navigation.navigate("Detail", { id: product._id });
    }
  };

  const handleLongPress = (id) => {
    toggleSelect(id);
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const confirmDelete = () => {
    Alert.alert("Xác nhận", `Xóa ${selected.length} sản phẩm khỏi yêu thích?`, [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await removeFromWishlist({ productId: selected });
            setProducts((prev) =>
              prev.filter((p) => !selected.includes(p._id))
            );
            setSelected([]);
          } catch (err) {
            Alert.alert("Lỗi", "Không thể xóa sản phẩm.");
          }
        },
      },
    ]);
  };

  const renderRightActions = (id) => (
    <TouchableOpacity
      onPress={() =>
        Alert.alert("Xác nhận", "Xóa khỏi yêu thích?", [
          { text: "Huỷ", style: "cancel" },
          {
            text: "Xóa",
            style: "destructive",
            onPress: async () => {
              try {
                await removeFromWishlist({ productId: [id] });
                setProducts((prev) => prev.filter((p) => p._id !== id));
              } catch {
                Alert.alert("Lỗi", "Không thể xóa sản phẩm.");
              }
            },
          },
        ])
      }
      style={{
        backgroundColor: "#ef4444",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        marginBottom: 12,
      }}
    >
      <Ionicons name="trash-outline" size={24} color="white" />
      <Text style={{ color: "#fff", fontSize: 12, marginTop: 4 }}>Xóa</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    const isSelected = selected.includes(item._id);

    return (
      <Swipeable
        ref={(ref) => (swipeableRefs.current[item._id] = ref)}
        enabled={selected.length === 0}
        renderRightActions={() => renderRightActions(item._id)}
        onSwipeableWillOpen={() => {
          if (
            currentOpenSwipeable.current &&
            currentOpenSwipeable.current !== swipeableRefs.current[item._id]
          ) {
            currentOpenSwipeable.current.close();
          }
          currentOpenSwipeable.current = swipeableRefs.current[item._id];
        }}
      >
        <TouchableOpacity
          onPress={() => handlePress(item)}
          onLongPress={() => handleLongPress(item._id)}
          style={{
            backgroundColor: isSelected ? "#fee2e2" : "#fff",
            borderRadius: 10,
            padding: 12,
            marginHorizontal: 16,
            marginBottom: 12,
            flexDirection: "row",
            alignItems: "center",
            elevation: 1,
          }}
        >
          <Image
            source={{ uri: item.image_on_list }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 8,
              backgroundColor: "#eee",
            }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {item.name_on_list}
            </Text>
            <Text
              style={{
                color: "#e91e63",
                marginTop: 4,
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
              {Number(item.price_on_list).toLocaleString("vi-VN")} ₫
            </Text>
          </View>
          {selected.length > 0 && (
            <Ionicons
              name={isSelected ? "checkbox-outline" : "square-outline"}
              size={24}
              color={isSelected ? "#ef4444" : "#aaa"}
            />
          )}
        </TouchableOpacity>
      </Swipeable>
    );
  };

  if (loadingIds || loadingProducts || removing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LoadingScreen />
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#666" }}>Chưa có sản phẩm yêu thích.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {selected.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderColor: "#eee",
            backgroundColor: "#fff7ed",
          }}
        >
          <TouchableOpacity
            onPress={() => setSelected(products.map((p) => p._id))}
          >
            <Text style={{ color: "#f97316", fontWeight: "bold" }}>
              Chọn tất cả
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmDelete}>
            <Text style={{ color: "#ef4444", fontWeight: "bold" }}>
              Xóa đã chọn
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelected([])}>
            <Text style={{ color: "#555", fontWeight: "bold" }}>Huỷ</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </View>
  );
}
