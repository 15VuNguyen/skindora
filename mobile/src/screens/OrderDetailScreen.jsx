import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import privateAxios from "../utils/axiosPrivate";
import { useNavigation } from "@react-navigation/native";

export default function OrderDetailScreen({ route }) {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [orderDetail, setOrderDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchOrderDetail = async () => {
    try {
      const { data } = await privateAxios.get(`/orders/${orderId}`);
      setOrder(data.result.order);
      setOrderDetail(data.result.orderDetail);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00C897" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.orderId}>Mã đơn: {order._id}</Text>
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Người nhận</Text>
        <Text style={styles.infoText}>{order.RecipientName}</Text>
        <Text style={styles.infoLabel}>Số điện thoại</Text>
        <Text style={styles.infoText}>{order.PhoneNumber}</Text>
        <Text style={styles.infoLabel}>Địa chỉ giao hàng</Text>
        <Text style={styles.infoText}>{order.ShipAddress}</Text>
        <Text style={styles.infoLabel}>Phương thức thanh toán</Text>
        <Text style={styles.infoText}>{order.PaymentMethod}</Text>
        <Text style={styles.infoLabel}>Trạng thái</Text>
        <Text style={[styles.infoText, styles.statusText]}>{order.Status}</Text>
      </View>

      <Text style={styles.subHeading}>Danh Sách Sản Phẩm</Text>
      {orderDetail.map((item, index) => {
        const product = item.Products || {};
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate("Detail", { id: item.Products?.productId })}
          >
            {console.log(item._id)}
            <View key={index} style={styles.productCard}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>
                  {Number(product.price).toLocaleString("vi-VN")} ₫
                </Text>
                <Text style={styles.quantityText}>
                  Số lượng: {item.Quantity}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Tổng tiền</Text>
        <Text style={styles.totalAmount}>
          {Number(order.TotalPrice).toLocaleString("vi-VN")} ₫
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#fff", // Đồng bộ với trang Home
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Đồng bộ với trang Home
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333", // Đồng bộ với categoryText
  },
  orderId: {
    fontSize: 14,
    color: "#999", // Đồng bộ với searchText
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: "#f1f1f1", // Đồng bộ với searchInput và categoryItem
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999", // Đồng bộ với searchText
    marginTop: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#333", // Đồng bộ với categoryText
    marginBottom: 4,
  },
  statusText: {
    color: "#00C897", // Màu xanh của categoryItemSelected
    fontWeight: "600",
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333", // Đồng bộ với categoryText
    marginVertical: 12,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1", // Đồng bộ với searchInput và categoryItem
    borderRadius: 16,
    padding: 12,
    marginVertical: 8,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333", // Đồng bộ với categoryText
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#00C897", // Màu xanh của categoryItemSelected
    marginBottom: 4,
  },
  quantityText: {
    fontSize: 14,
    color: "#999", // Đồng bộ với searchText
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f1f1f1", // Đồng bộ với searchInput và categoryItem
    borderRadius: 20, // Bo tròn giống searchInput
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333", // Đồng bộ với categoryText
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00C897", // Màu xanh của categoryItemSelected
  },
});
