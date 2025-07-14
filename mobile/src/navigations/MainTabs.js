import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeStack from "./HomeStack";
import ProfileStack from "./ProfileStack";
import CartStack from "./CartStack";
import { useCart } from "../hooks/useCart";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { cart } = useCart();

  const cartItemCount = cart?.Products
    ? cart.Products.reduce((sum, item) => sum + item.Quantity, 0)
    : 0;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#e11d48",
        tabBarInactiveTintColor: "#6b7280",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { paddingVertical: 6, height: 60 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "HomeTab":
              iconName = focused ? "home" : "home-outline";
              break;
            case "CartTab":
              iconName = focused ? "cart" : "cart-outline";
              break;
            case "ProfileTab":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ title: "Trang chủ" }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStack}
        options={{
          title: "Giỏ hàng",
          tabBarBadge: cartItemCount > 0 ? cartItemCount : null,
          tabBarBadgeStyle: { backgroundColor: "#e11d48", color: "#fff" },
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: "Cá nhân" }}
      />
    </Tab.Navigator>
  );
}
