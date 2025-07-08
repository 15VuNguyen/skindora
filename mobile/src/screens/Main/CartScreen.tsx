import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CartStackParamList } from "../../types/navigation";
import { Voucher, DiscountType } from "../../types/voucher";
import BulkActionsBar from "../../components/BulkActionsBar";
import { useFocusEffect } from "@react-navigation/native";
import ProductInCart from "../../components/ProductInCart";

const paymentLabelStyles: Record<string, any> = {
  cod: { color: "#4b5563", textAlign: "right" },
  momo: { color: "#ec4899", textAlign: "right" },
  zalo: { color: "#008fe5", textAlign: "right" },
  bank: { color: "#10b981", textAlign: "right" },
};

const paymentLabelMap: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng",
  momo: "Ví Momo",
  zalo: "Ví ZaloPay",
  bank: "Chuyển khoản ngân hàng",
};

type Props = NativeStackScreenProps<CartStackParamList, "Cart">;

const CartScreen = ({ navigation, route }: Props) => {
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Sữa Rửa Mặt Cocoon Bí Đao",
      price: 250000,
      quantity: 1,
      image:
        "https://mint07.com/wp-content/uploads/2023/06/sua-rua-mat-cocoon-bi-dao-140ml-1-768x768.jpg",
    },
    {
      id: "2",
      name: "Tẩy Tế Bào Chết Da Mặt Cocoon Từ Cà Phê Làm Sạch Sâu Cho Mọi Loại Da 150ml",
      price: 575000,
      quantity: 1,
      image:
        "https://yoy.vn/upload/images/tay-da-chet/cocoon-ca-phe-mat/ttbc-tai-nha-cho-da-dau-review.jpeg",
    },
    {
      id: "3",
      name: "Tẩy Tế Bào Chết Da Mặt Cocoon Từ Cà Phê Làm Sạch Sâu Cho Mọi Loại Da 150ml",
      price: 575000,
      quantity: 1,
      image:
        "https://yoy.vn/upload/images/tay-da-chet/cocoon-ca-phe-mat/ttbc-tai-nha-cho-da-dau-review.jpeg",
    },
    {
      id: "4",
      name: "Tẩy Tế Bào Chết Da Mặt Cocoon Từ Cà Phê Làm Sạch Sâu Cho Mọi Loại Da 150ml",
      price: 575000,
      quantity: 1,
      image:
        "https://yoy.vn/upload/images/tay-da-chet/cocoon-ca-phe-mat/ttbc-tai-nha-cho-da-dau-review.jpeg",
    },
  ]);
  const [selectProductIds, setSelectProductIds] = useState<Array<string>>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | undefined>(
    undefined
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | undefined
  >(undefined);

  const { selectedVoucher, selectedPaymentMethod: paymentFromRoute } =
    route.params || {};

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  useEffect(() => {
    if (selectedVoucher) {
      setAppliedVoucher(selectedVoucher);
    }
  }, [selectedVoucher]);

  useEffect(() => {
    if (paymentFromRoute) {
      setSelectedPaymentMethod(paymentFromRoute);
    }
  }, [paymentFromRoute]);

  const discountAmount = useMemo(() => {
    if (!appliedVoucher) return 0;
    if (
      appliedVoucher.minTotalApplicable &&
      total < appliedVoucher.minTotalApplicable
    )
      return 0;

    let discount = 0
    if (appliedVoucher.discountType === DiscountType.FIXED) {
      discount = appliedVoucher.discountAmount;
    }

    if (appliedVoucher.discountType === DiscountType.PERCENTAGE) {
      discount = (total * appliedVoucher.discountAmount) / 100;
    }

    if(appliedVoucher.maxDiscountAmount){
      return Math.min(discount, appliedVoucher.maxDiscountAmount)
    }

    return discount;
  }, [appliedVoucher, total]);

  const finalPrice = total - discountAmount;

  const updateQuantity = (id: string, change: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  useFocusEffect(
    useCallback(() => {
      setSelectProductIds([]);
    }, [])
  );

  const handleDelete = (ids: Array<string>) => {
    //TODO: gọi api || xoá hàng khỏi giỏ bằng AsyncStorage
    setSelectProductIds([]);
  };

  const confirmDelete = () => {
    Alert.alert(
      "Xác nhận",
      `Xóa ${selectProductIds.length} sản phẩm khỏi giỏ hàng?`,
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => handleDelete(selectProductIds),
        },
      ]
    );
  };

  const toggleSelect = (id: string) => {
    setSelectProductIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {selectProductIds.length > 0 && (
        <BulkActionsBar
          products={cartItems}
          setSelected={setSelectProductIds}
          confirmDelete={confirmDelete}
        />
      )}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductInCart
            item={item}
            selected={selectProductIds}
            onPress={() =>
                selectProductIds.length
                  ? toggleSelect(item.id)
                  : navigation.navigate("Detail", { id: item.id })
              }
            updateQuantity={updateQuantity}
            toggleSelect={toggleSelect}
          />
        )}
      />
      <View style={styles.stickyFooter}>
        <View style={[styles.voucherSection, styles.stickyFooterSection]}>
          <Text style={styles.label}>Skindora Voucher:</Text>
          <TouchableOpacity
            style={[styles.selectedSection]}
            onPress={() =>
              navigation.navigate("VoucherApplication", {
                selectedVoucher: appliedVoucher,
                selectedPaymentMethod,
              })
            }
          >
            <Text
              numberOfLines={1}
              style={[
                styles.notSelectedText,
                appliedVoucher && styles.selectedVoucher,
              ]}
            >
              {appliedVoucher ? appliedVoucher.code : "Chọn hoặc nhập mã"}
            </Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
        <View style={[styles.stickyFooterSection]}>
          <Text style={styles.label}>Phương thức thanh toán:</Text>
          <TouchableOpacity
            style={[styles.selectedSection]}
            onPress={() =>
              navigation.navigate("PaymentMethod", {
                selectedVoucher: appliedVoucher,
                selectedPaymentMethod,
              })
            }
          >
            <Text
              numberOfLines={1}
              style={[
                styles.notSelectedText,
                selectedPaymentMethod &&
                  paymentLabelStyles[selectedPaymentMethod],
              ]}
            >
              {selectedPaymentMethod
                ? paymentLabelMap[selectedPaymentMethod] ||
                  selectedPaymentMethod
                : "Chọn phương thức thanh toán"}
            </Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
        <View style={[styles.checkoutSection]}>
          <View style={styles.totalPrice}>
            <Text style={styles.totalText}>
              Tổng: {total.toLocaleString()} đ
            </Text>
            {appliedVoucher && (
              <Text style={styles.discountText}>
                (Giảm {discountAmount.toLocaleString()}đ)
              </Text>
            )}
          </View>
          <TouchableOpacity style={styles.checkoutBtn}>
            <Text style={styles.checkoutText}>
              Mua Hàng ({cartItems.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  stickyFooter: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  stickyFooterSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 10,
  },
  voucherSection: {},
  label: { fontSize: 14, color: "#333" },
  selectedSection: {
    width: 150,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notSelectedText: {
    width: 130,
    flexWrap: "nowrap",
    color: "#ccc",
  },
  selectedVoucher: {
    color: "rgb(0, 200, 151)",
    textAlign: "right",
  },
  checkoutSection: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  totalPrice: {
    marginRight: 10,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  discountText: {
    color: "#10b981",
    fontSize: 12,
    textAlign: "right",
  },
  checkoutBtn: {
    backgroundColor: "#ff4444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  checkoutText: { color: "#fff", fontWeight: "bold" },
});

export default CartScreen;
