import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../hooks/useAuth";
import privateAxios from "../utils/axiosPrivate";
import { DiscountType } from "../constants/enum";
import RecipientInfoSection from "../components/RecipientInfoSection";
import { useCart } from "../hooks/useCart";

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { setCart } = useCart();

  const {
    cart,
    selectedVoucher,
    recipientInfo: savedInfo,
  } = route.params || {};

  const [recipientInfo, setRecipientInfo] = useState(
    savedInfo || {
      name: user?.first_name || "",
      phone: user?.phone_number || "",
      address: user?.location || "",
    }
  );

  if (!cart) {
    console.error("CheckoutScreen: cart is undefined");
    return (
      <View>
        <Text>Lỗi: Không có thông tin giỏ hàng</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <Text>Quay lại giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const total = cart.TotalPrice;

  const discountAmount = (() => {
    if (!selectedVoucher) return 0;
    if (selectedVoucher.minOrderValue && total < selectedVoucher.minOrderValue)
      return 0;

    let discount = 0;
    if (selectedVoucher.discountType === DiscountType.FIXED) {
      discount = selectedVoucher.discountValue;
    } else if (selectedVoucher.discountType === DiscountType.PERCENTAGE) {
      discount = (total * selectedVoucher.discountValue) / 100;
    }

    return selectedVoucher.maxDiscountAmount
      ? Math.min(discount, selectedVoucher.maxDiscountAmount)
      : discount;
  })();

  const finalTotal = total - discountAmount;

  const handleOrder = async () => {
    const { name, phone, address } = recipientInfo;

    if (!name || !phone || !address) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin người nhận.");
      return;
    }

    try {
      const payload = {
        voucherCode: selectedVoucher?.code,
        PaymentMethod: "COD",
        RecipientName: name,
        PhoneNumber: phone,
        ShipAddress: address,
      };

      const { data } = await privateAxios.post("/orders/checkout", payload);
      setCart([]);
      Alert.alert("Thành công", "Đơn hàng đã được tạo!");
      navigation.navigate("OrderSuccessScreen", { orderId: data.result?.orderId });
    } catch (err) {
      const message = err?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau.";
      Alert.alert("Lỗi", message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <RecipientInfoSection
        recipientInfo={recipientInfo}
        setRecipientInfo={setRecipientInfo}
      />

      {/* Danh sách sản phẩm */}
      <View style={styles.section}>
        {cart.Products.map((item, index) => (
          <View
            key={item.ProductID}
            style={[
              styles.productRow,
              index !== cart.Products.length - 1 && styles.productRowBorder,
            ]}
          >
            <Image source={{ uri: item.Image }} style={styles.productImage} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.productName}>{item.Name}</Text>
              <View style={styles.productDetailWrapper}>
                <Text style={styles.productDetailText}>x{item.Quantity}</Text>
                <Text style={styles.productDetailText}>
                  {item.PricePerUnit.toLocaleString()} đ
                </Text>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>
            Tổng ({cart.Products.reduce((sum, p) => sum + p.Quantity, 0)} sản phẩm):
          </Text>
          <Text style={styles.summaryText}>
            {cart.TotalPrice.toLocaleString()} đ
          </Text>
        </View>
      </View>

      {/* Mã giảm giá */}
      <TouchableOpacity
        style={styles.section}
        onPress={() =>
          navigation.navigate("VoucherApplication", {
            selectedVoucher,
            cart,
            recipientInfo,
          })
        }
      >
        <Text style={styles.label}>Mã giảm giá:</Text>
        <Text style={styles.voucherText}>
          {selectedVoucher?.code || "Chọn hoặc nhập mã"}
        </Text>
      </TouchableOpacity>

      {/* Phương thức thanh toán (mặc định) */}
      <View style={styles.section}>
        <Text style={styles.label}>Phương thức thanh toán:</Text>
        <Text style={styles.voucherText}>Thanh toán khi nhận hàng</Text>
      </View>

      {/* Tổng tiền */}
      <View style={styles.section}>
        <Text style={styles.totalText}>Tổng: {total.toLocaleString()} đ</Text>
        {discountAmount > 0 && (
          <Text style={styles.discountText}>
            Giảm: {discountAmount.toLocaleString()} đ
          </Text>
        )}
        <Text style={styles.finalText}>
          Thanh toán: {finalTotal.toLocaleString()} đ
        </Text>
      </View>

      {/* Nút đặt hàng */}
      <TouchableOpacity style={styles.checkoutBtn} onPress={handleOrder}>
        <Text style={styles.checkoutText}>Đặt hàng</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    fontWeight: "500",
  },
  productRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  productRowBorder: {
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: "#eee",
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  productDetailWrapper: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productDetailText: {
    fontSize: 13,
    color: "#666",
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 10,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  voucherText: { fontSize: 14, color: "#10b981", marginTop: 4 },
  totalText: { fontSize: 16, color: "#444" },
  discountText: { fontSize: 14, color: "#10b981" },
  finalText: { fontSize: 18, fontWeight: "bold", color: "#e11d48" },
  checkoutBtn: {
    backgroundColor: "#e11d48",
    margin: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
