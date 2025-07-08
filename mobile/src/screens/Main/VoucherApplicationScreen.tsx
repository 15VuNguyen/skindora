import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CartStackParamList } from "../../types/navigation";
import { Voucher, DiscountType } from "../../types/voucher";

type Props = NativeStackScreenProps<CartStackParamList, "VoucherApplication">;

const availableVouchers: Voucher[] = [
  {
    id: "1",
    code: "SKIN20%",
    name: "Giảm 20% cho đơn hàng đầu tiên, tối đa 150.000đ",
    discountType: DiscountType.PERCENTAGE,
    discountAmount: 20,
    minTotalApplicable: 0,
    maxDiscountAmount: 150000
  },
  {
    id: "2",
    code: "SKIN50",
    name: "Giảm 50K cho đơn trên 300.000đ",
    discountType: DiscountType.FIXED,
    discountAmount: 50000,
    minTotalApplicable: 300000,
  },
];

const VoucherApplicationScreen = ({ navigation, route }: Props) => {
  const { selectedVoucher, selectedPaymentMethod } = route.params || {};
  const handleSelectVoucher = (voucher: Voucher) => {
    navigation.navigate("Cart", {
      selectedVoucher: voucher,
      selectedPaymentMethod,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={availableVouchers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedVoucher?.id === item.id;
          return (
            <TouchableOpacity
              style={[
                styles.voucherItem,
                isSelected && styles.voucherItemSelected,
              ]}
              onPress={() => handleSelectVoucher(item)}
            >
              <Text
                style={[
                  styles.voucherCode,
                  isSelected && styles.voucherTextSelected,
                ]}
              >
                {item.code}
              </Text>
              <Text
                style={[
                  styles.voucherName,
                  isSelected && styles.voucherTextSelected,
                ]}
              >
                {item.name}
              </Text>
              <Text
                style={[
                  styles.conditionText,
                  isSelected && styles.voucherTextSelected,
                ]}
              >
                {item.minTotalApplicable
                  ? `Áp dụng cho đơn từ ${item.minTotalApplicable.toLocaleString()}đ`
                  : "Không yêu cầu giá trị tối thiểu"}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
  voucherItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  voucherCode: { fontWeight: "bold", fontSize: 16, color: "#ef4444" },
  voucherName: { marginTop: 5, color: "#374151" },
  conditionText: { marginTop: 5, fontSize: 12, color: "#6b7280" },
  voucherItemSelected: {
    backgroundColor: "#10b981",
    borderColor: "#059669",
  },

  voucherTextSelected: {
    color: "#fff",
  },
});

export default VoucherApplicationScreen;
