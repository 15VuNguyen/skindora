import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useFetch from "../hooks/common/useFetch";
import { productEndpoints } from "../config/api";
import ProductCard from "../components/ProductCard";
import ErrorScreen from "./ErrorScreen";
import LocationHeader from "../components/LocationHeader";
import BannerCarousel from "../components/BannerCarousel";
import { Search } from "lucide-react-native";

export default function ProductListScreen({ searchFromParam }) {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);

  const {
    data: categoryDataRaw,
    loading: categoryLoading,
    error: categoryError,
  } = useFetch("/products/get-all-filter-hsk-product-types");

  const categories = [
    { label: "Tất cả", value: null },
    ...(categoryDataRaw?.map((item) => ({
      label: item.option_name,
      value: item._id,
    })) || []),
  ];

  const { data, loading, error, refetch } = useFetch(
    productEndpoints.list,
    true,
    true,
    {
      page,
      limit: 12,
      ...(search ? { q: search } : {}),
      ...(selectedCategoryId
        ? { filter_hsk_product_type: selectedCategoryId }
        : {}),
    }
  );

  useEffect(() => {
    if (searchFromParam) {
      setSearch(searchFromParam);
      setPage(1);
      setProducts([]);
    }
  }, [searchFromParam]);

  useEffect(() => {
    if (!data) return;
    if (page === 1) {
      setProducts(data);
    } else {
      setProducts((prev) => [...prev, ...data]);
    }
  }, [data]);

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;

    if (isBottom && data?.length >= 12) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSearchClear = () => {
    setSearch("");
    setPage(1);
    setProducts([]);
  };

  const handleSelectCategory = (value) => {
    setSelectedCategoryId(value);
    setPage(1);
    setProducts([]);
  };

  if ((loading && page === 1) || categoryLoading)
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  if (error || categoryError)
    return (
      <ErrorScreen
        message="Không thể tải dữ liệu!"
        onRetry={() => {
          refetch();
        }}
      />
    );

  return (
    <ScrollView
      style={styles.container}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    >
      <LocationHeader />
      <BannerCarousel />

      <TouchableOpacity
        style={styles.searchInput}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("SearchScreen")}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Search size={18} color="#888" />
          <Text
            style={[styles.searchText, { marginLeft: 8, flex: 1 }]}
            numberOfLines={1}
          >
            {search ? search : "Tìm kiếm sản phẩm hoặc cửa hàng..."}
          </Text>

          {search.length > 0 && (
            <TouchableOpacity onPress={handleSearchClear}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, marginVertical: 10 }}
        style={{ height: 50, marginBottom: 12 }}
      >
        {categories.map((item) => (
          <TouchableOpacity
            key={item.value ?? "all"}
            style={[
              styles.categoryItem,
              selectedCategoryId === item.value && styles.categoryItemSelected,
            ]}
            onPress={() => handleSelectCategory(item.value)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategoryId === item.value &&
                  styles.categoryTextSelected,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.gridContainer}>
        {products.map((item) => (
          <ProductCard
            key={item._id}
            product={item}
            onPress={() => navigation.navigate("Detail", { id: item._id })}
            style={{ width: "48%", marginBottom: 16 }}
          />
        ))}
      </View>

      {loading && page > 1 && (
        <ActivityIndicator size="small" style={{ marginBottom: 20 }} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  categoryItem: {
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 36,
  },
  categoryItemSelected: {
    backgroundColor: "#00C897",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  categoryTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  searchInput: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 4,
    backgroundColor: "#f1f1f1",
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 40,
    justifyContent: "center",
  },
  searchText: {
    fontSize: 16,
    color: "#999",
  },
  clearText: {
    fontSize: 18,
    color: "#666",
    marginLeft: 8,
  },
});
