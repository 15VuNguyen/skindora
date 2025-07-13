import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DetailScreen from "../screens/DetailScreen";
import CartScreen from "../screens/CartScreen";
import VoucherApplicationScreen from "../screens/VoucherApplicationScreen";
import PaymentMethodScreen from "../screens/PaymentMethodScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import EditRecipientScreen from "../screens/EditRecipientScreen";
import OrderSuccessScreen from "../screens/OrderSuccessScreen";

const Stack = createNativeStackNavigator();

export default function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: "Giỏ hàng"}}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: "Chi tiết sản phẩm" }}
      />
      <Stack.Screen
        name="VoucherApplication"
        component={VoucherApplicationScreen}
        options={{ title: "Vouchers" }}
      />
      <Stack.Screen
        name="PaymentMethod"
        component={PaymentMethodScreen}
        options={{ title: "Phương thức thanh toán" }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: "Thanh toán" }}
      />
      <Stack.Screen
        name="EditRecipient"
        component={EditRecipientScreen}
        options={{ title: "Thông tin người nhận" }}
      />
      <Stack.Screen
        name="OrderSuccessScreen"
        component={OrderSuccessScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
