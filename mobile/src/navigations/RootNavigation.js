import LoadingScreen from "../screens/LoadingScreen";
import { useAuth } from "../hooks/useAuth";
import MainTabsWithAuth from "./MainTabsWithAuth";
import MainTabs from "./MainTabs";

export default function RootNavigator() {
  const { accessToken, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  return accessToken ? <MainTabs /> : <MainTabsWithAuth/>;
}
