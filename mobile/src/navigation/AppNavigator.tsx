import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../hooks/useAuth";
import { ActivityIndicator, View } from "react-native";

import {
  TabParamList,
} from "../types/navigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeNavigator from "./HomeNavigator";
import NotificationNavigator from "./NotificationNavigator";
import ProfileNavigator from "./ProfileNavigator";
import SearchNavigator from "./SearchNavigator";
import AuthNavigator from "./AuthNavigator";

const Tab = createBottomTabNavigator<TabParamList>();

const BottomTab = () => (
  <Tab.Navigator screenOptions={{headerShown: false}}>
    <Tab.Screen
      name="HomeTab"
      component={HomeNavigator}
      options={{ title: "Trang chủ" }}
    />
    <Tab.Screen
      name="SearchTab"
      component={SearchNavigator}
      options={{ title: "Tìm kiếm" }}
    />
    <Tab.Screen
      name="NotificationTab"
      component={NotificationNavigator}
      options={{ title: "Thông báo" }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileNavigator}
      options={{ title: "Tài khoản" }}
    />
  </Tab.Navigator>
);

export const AppNavigator = () => {
  const { accessToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {accessToken ? <BottomTab /> : <AuthNavigator />}
      {/* {<BottomTab />} */}
    </NavigationContainer>
  );
};
