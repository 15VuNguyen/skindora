import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import useFetch from "../hooks/common/useFetch";

export default function OrderListScreen() {
  const {
    data: orders = [],
    loading,
    error,
    refetch,
  } = useFetch("/orders/me", true, false);

  const renderOrder = ({ item }) => {
    let totalAmount = 0;

    const orderItems = item.orderDetail.map((detail, index) => {
      const product = detail.Products || {};
      const createdAt = new Date(detail.OrderDate).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const unitPrice = Number(product.price) || 0;
      const quantity = Number(detail.Quantity) || 0;
      const subtotal = unitPrice * quantity;
      totalAmount += subtotal;

      return (
        <View key={index} style={styles.productRow}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.productInfo}>
            <Text numberOfLines={1} style={styles.productName}>
              {product.name}
            </Text>
            <Text style={styles.productPrice}>
              Giá: {unitPrice.toLocaleString("vi-VN")} ₫
            </Text>
            <Text style={styles.quantity}>Số lượng: {quantity}</Text>
            <Text style={styles.date}>Ngày đặt: {createdAt}</Text>
          </View>
        </View>
      );
    });

    return (
      <View style={styles.orderCard}>
        <Text style={styles.orderId}>Mã đơn hàng: {item.orderId}</Text>
        {orderItems}
        <Text style={styles.totalAmount}>
          Tổng tiền: {totalAmount.toLocaleString("vi-VN")} ₫
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00C897" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Không thể tải đơn hàng.</Text>
        <Text style={{ color: "#00C897", marginTop: 8 }} onPress={refetch}>
          Thử lại
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tất cả đơn hàng</Text>
      {orders.length === 0 ? (
        <Text style={styles.empty}>Bạn chưa có đơn hàng nào.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item, idx) => `${item.orderId}-${idx}`}
          renderItem={renderOrder}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#111",
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  orderCard: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    backgroundColor: "#fdfdfd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  orderId: {
    fontWeight: "bold",
    marginBottom: 12,
    fontSize: 16,
    color: "#333",
  },
  productRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#f0f0f0",
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-around",
  },
  productName: {
    fontWeight: "600",
    fontSize: 15,
    color: "#222",
  },
  productPrice: {
    color: "#e91e63",
    fontWeight: "bold",
    fontSize: 14,
  },
  quantity: {
    fontSize: 13,
    color: "#555",
  },
  date: {
    fontSize: 13,
    color: "#555",
  },
  totalAmount: {
    marginTop: 10,
    textAlign: "right",
    fontWeight: "700",
    color: "#10b981",
    fontSize: 16,
  },
});
