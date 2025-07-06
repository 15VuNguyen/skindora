import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../types/navigation";
import HomeScreen from "../screens/Main/HomeScreen";
import ProductDetailScreen from "../screens/Main/ProductDetailScreen";

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: "Trang chủ" }}
    />
    <Stack.Screen
      name="Detail"
      component={ProductDetailScreen}
      options={{ title: "Chi tiết sản phẩm" }}
    />
  </Stack.Navigator>
);

export default HomeNavigator