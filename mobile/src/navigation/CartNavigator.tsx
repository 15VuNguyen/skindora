import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CartStackParamList } from "../types/navigation";
import ProductDetailScreen from "../screens/Main/ProductDetailScreen";
import CartScreen from "../screens/Main/CartScreen";
import VoucherApplicationScreen from "../screens/Main/VoucherApplicationScreen";
import CheckoutScreen from "../screens/Main/CheckoutScreen";
import PaymentMethodScreen from "../screens/Main/PaymentMethodScreen";

const Stack = createNativeStackNavigator<CartStackParamList>();

const CartNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Cart"
      component={CartScreen}
      options={{ title: "Giỏ hàng" }}
    />
    <Stack.Screen
      name="Detail"
      component={ProductDetailScreen}
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
  </Stack.Navigator>
);

export default CartNavigator