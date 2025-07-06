import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SearchStackParamList } from "../types/navigation";
import SearchScreen from "../screens/Main/SearchScreen";
import ProductListScreen from "../screens/Main/ProductListScreen";

const Stack = createNativeStackNavigator<SearchStackParamList>();

const SearchNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Search"
      component={SearchScreen}
      options={{ title: "Tìm kiếm" }}
    />
    <Stack.Screen
      name="ProductList"
      component={ProductListScreen}
      options={{ title: "Kết quả tìm kiếm" }}
    />
    <Stack.Screen
      name="Detail"
      component={ProductListScreen}
      options={{ title: "Chi tiết sản phẩm" }}
    />
  </Stack.Navigator>
);

export default SearchNavigator;
