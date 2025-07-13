import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ArrowLeft, ShoppingCart, Heart, Search } from "lucide-react-native";
import Toast from "react-native-toast-message";
import useFetch from "../hooks/common/useFetch";
import usePost from "../hooks/common/usePost";
import { useCart } from "../hooks/useCart";
import usePut from "../hooks/common/usePut";
import { getAccessToken } from "../utils/tokenStorage";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const { id } = route.params || {};
  const [filteredRating, setFilteredRating] = useState(null);
  const { addToCart } = useCart();
  const [reviewStats, setReviewStats] = useState({
    total: 0,
    average: 0,
    grouped: {},
  });

  const {
    data: product,
    loading: loadingProduct,
    error: productError,
    refetch: refetchProduct,
  } = useFetch(`/products/${id}`, true, true);

  const {
    data: reviews = [],
    loading: loadingReviews,
    refetch: refetchReviews,
    setData: setReviews,
  } = useFetch(
    `/review/${id}/review`,
    true,
    true,
    filteredRating ? { rating: filteredRating } : null,
    (res) => {
      if (!Array.isArray(res.data)) return;
      setReviews(res.data);
      if (filteredRating === null) {
        setReviewStats({
          total: res.total || 0,
          average: res.average || 0,
          grouped: res.grouped || {},
        });
      }
    }
  );

  const {
    data: wishlist = [],
    loading: loadingWishlist,
    setData: setWishlist,
  } = useFetch("/users/getWishList", true, false);

  const { post: addToWishlist, loading: wishlistLoading } = usePost(
    "/users/addToWishList"
  );
  const { put: removeFromWishlist, loading: removingWishlist } = usePut(
    "/users/removeFromWishList"
  );

  const images = [product?.image_on_list, product?.hover_image_on_list].filter(
    Boolean
  );

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (images.length > 1) {
        index = (index + 1) % images.length;
        scrollRef.current?.scrollTo({ x: width * index, animated: true });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  const isInWishlist = Array.isArray(wishlist) && wishlist.includes(id);

  const handleAddToWishList = async () => {
    const token = await getAccessToken();
    if (!token) {
      navigation.navigate("Login");
      return;
    }

    const body = { productId: [id] };

    try {
      if (isInWishlist) {
        await removeFromWishlist(body);
        setWishlist(wishlist.filter((pid) => pid !== id));
      } else {
        await addToWishlist(body);
        setWishlist([...wishlist, id]);
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1:
          err?.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.",
        visibilityTime: 2000,
      });
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart({ ProductID: id, Quantity: 1 });
      Toast.show({
        type: "success",
        text1: "Đã thêm vào giỏ hàng",
        visibilityTime: 1500,
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text1:
          err?.response?.data?.message ||
          "Lỗi khi thêm vào giỏ hàng, vui lòng thử lại sau.",
      });
    }
  };

  if (loadingProduct) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00C897" />
      </View>
    );
  }

  if (productError || !product) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy sản phẩm</Text>
        <TouchableOpacity onPress={refetchProduct} style={{ marginTop: 12 }}>
          <Text style={{ color: "#00C897" }}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CartTab")}>
          <ShoppingCart size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchRow}>
          <TouchableOpacity
            style={styles.searchInput}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("SearchScreen")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Search size={18} color="#888" />
              <Text style={[styles.searchText, { marginLeft: 8 }]}>
                Tìm kiếm sản phẩm hoặc cửa hàng...
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
        >
          {images.map((img, idx) => (
            <View key={idx} style={styles.productImage}>
              <Image
                source={{ uri: img }}
                style={styles.carouselImage}
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>

        <View style={styles.infoContainer}>
          <View style={styles.row}>
            <Text style={styles.title}>{product.name_on_list}</Text>
            <TouchableOpacity
              onPress={handleAddToWishList}
              disabled={wishlistLoading || removingWishlist}
            >
              <Heart
                size={22}
                color={isInWishlist ? "#e91e63" : "#999"}
                fill={isInWishlist ? "#e91e63" : "none"}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.subText}>
            {product.substance || "acetylsalicylic acid."}
          </Text>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.price}>
            {Number(product.price_on_list).toLocaleString("vi-VN")} ₫
          </Text>

          <View style={styles.row}>
            {reviewStats.total === 0 ? (
              <Text style={styles.ratingCount}>Chưa có đánh giá nào</Text>
            ) : (
              <View style={styles.row}>
                <Text style={styles.ratingText}>
                  {reviewStats.average.toFixed(1)} ★
                </Text>
                <Text style={styles.ratingCount}>
                  ({reviewStats.total} đánh giá)
                </Text>
              </View>
            )}
          </View>

          {reviewStats.total > 0 && (
            <View style={{ marginTop: 12 }}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviewStats.grouped[star] || 0;
                const percentage = ((count / reviewStats.total) * 100).toFixed(
                  0
                );
                return (
                  <TouchableOpacity
                    key={star}
                    onPress={() => {
                      setFilteredRating(star);
                      refetchReviews();
                    }}
                    style={styles.groupedRowShopee}
                  >
                    <Text style={{ width: 40 }}>{star} ★</Text>
                    <View style={styles.progressBarWrapper}>
                      <View
                        style={[
                          styles.progressBar,
                          { width: `${percentage}%` },
                        ]}
                      />
                    </View>
                    <Text style={{ width: 30, textAlign: "right" }}>
                      {count}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {filteredRating && (
                <TouchableOpacity
                  onPress={() => {
                    setFilteredRating(null);
                    refetchReviews();
                  }}
                >
                  <Text style={{ color: "#00C897", marginTop: 8 }}>
                    Xóa lọc ({filteredRating} ★)
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Stock */}
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>Còn hàng</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
            Đánh giá sản phẩm
          </Text>
          {loadingReviews ? (
            <ActivityIndicator size="small" color="#00C897" />
          ) : reviews.length === 0 ? (
            <Text style={{ marginBottom: 20 }}>Chưa có đánh giá nào.</Text>
          ) : (
            reviews.map((review) => (
              <View key={review._id} style={styles.reviewCard}>
                <Text style={{ fontWeight: "bold" }}>{review.rating} ★</Text>
                <Text style={{ color: "#333", marginTop: 4 }}>
                  {review.comment}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
        <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    marginTop: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
    fontSize: 16,
  },
  searchText: {
    fontSize: 16,
    color: "#999",
  },
  carousel: { marginTop: 16 },
  productImage: {
    width,
    height: 300,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImage: { width: "90%", height: "90%", borderRadius: 12 },
  infoContainer: { padding: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: { fontSize: 20, fontWeight: "600", flex: 1, marginRight: 10 },
  subText: { fontSize: 14, color: "#666", marginBottom: 4 },
  category: {
    fontSize: 14,
    color: "#00C897",
    fontWeight: "500",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e91e63",
    marginBottom: 12,
  },
  ratingText: { fontWeight: "500", color: "#FFD700" },
  ratingCount: { color: "#999" },
  stockBadge: {
    backgroundColor: "#E6F9F3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  stockText: { color: "#00C897", fontWeight: "600" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  groupedRowShopee: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  progressBarWrapper: {
    flex: 1,
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    marginHorizontal: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#FFC107",
    borderRadius: 4,
  },
  reviewCard: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#FAFAFA",
  },
  addToCartBtn: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#00C897",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  addToCartText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
