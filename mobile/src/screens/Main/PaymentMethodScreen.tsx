import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CartStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<CartStackParamList, "PaymentMethod">;

const paymentOptions = [
  { id: "cod", name: "Thanh toán khi nhận hàng (COD)" },
  { id: "momo", name: "Ví điện tử Momo" },
  { id: "zalo", name: "Ví điện tử ZaloPay" },
  { id: "bank", name: "Chuyển khoản ngân hàng" },
];

const PaymentMethodScreen = ({ navigation, route }: Props) => {
  const { selectedVoucher, selectedPaymentMethod } = route.params || {};

  const handleSelectPayment = (method: string) => {
    navigation.navigate("Cart", {
      selectedPaymentMethod: method,
      selectedVoucher,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={paymentOptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedPaymentMethod === item.id;
          return (
            <TouchableOpacity
              style={[styles.methodItem, isSelected && styles.paymentSelected]}
              onPress={() => handleSelectPayment(item.id)}
            >
              <Text
                style={[
                  styles.methodText,
                  isSelected && styles.paymentTextSelected,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  methodItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  methodText: {
    fontSize: 16,
    color: "#111827",
  },
  paymentSelected: {
    backgroundColor: "#2e97ff",
  },
  paymentTextSelected: {
    color: "#fff",
  },
});

export default PaymentMethodScreen;
