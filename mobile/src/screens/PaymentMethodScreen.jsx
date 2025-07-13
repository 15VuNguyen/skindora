import { CommonActions } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

const paymentOptions = [
  { id: "COD", name: "Thanh toán khi nhận hàng (COD)" },
  { id: "VNPAY", name: "Ví VNPAY" },
  { id: "ZALOPAY", name: "Ví ZaloPay" },
];

const PaymentMethodScreen = ({ navigation, route }) => {
  const { selectedVoucher, selectedPaymentMethod } = route.params || {};

  const getPreviousScreen = () => {
    const routes = navigation.getState()?.routes;
    const currentRouteIndex = routes.findIndex(
      (r) => r.name === "PaymentMethod"
    );
    console.log("currentIndex: ", currentRouteIndex);
    if (currentRouteIndex > 0) {
      return routes[currentRouteIndex - 1].name;
    }
    return "Cart";
  };

  const handleSelectPayment = (method) => {
    const previousScreen = getPreviousScreen();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: previousScreen,
            params: {
              selectedPaymentMethod: method,
              selectedVoucher,
            },
          },
        ],
      })
    );
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
