import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabs from "./MainTabs";
import AuthStack from "./AuthStack";

const Stack = createNativeStackNavigator();

export default function MainTabsWithAuth() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Login" component={AuthStack} />
    </Stack.Navigator>
  );
}
