import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrderDetailScreen from "../screens/OrderDetailScreen";
import OrderListScreen from "../screens/OrderScreen";

const Stack = createNativeStackNavigator();

export default function OrderHistoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Orders"
        component={OrderListScreen}
        options={{ title: "Đơn hàng của bạn" }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: "Chi tiết đơn hàng" }}
      />
    </Stack.Navigator>
  );
}
