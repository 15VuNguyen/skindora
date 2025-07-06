import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../types/navigation";
import ProfileScreen from "../screens/Main/ProfileScreen";
import SettingsScreen from "../screens/Main/SettingsScreen";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: "Thông tin cá nhân" }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: "Cài đặt" }}
    />
  </Stack.Navigator>
);

export default ProfileNavigator