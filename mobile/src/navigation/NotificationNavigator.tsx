import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NotificationStackParamList } from "../types/navigation";
import ProductDetailScreen from "../screens/Main/ProductDetailScreen";
import NotificationScreen from "../screens/Main/NotificationScreen";

const Stack = createNativeStackNavigator<NotificationStackParamList>();

const NotificationNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Notification"
      component={NotificationScreen}
      options={{ title: "Thông báo" }}
    />
    <Stack.Screen
      name="Detail"
      component={ProductDetailScreen}
      options={{ title: "Chi tiết sản phẩm" }}
    />
  </Stack.Navigator>
);

export default NotificationNavigator