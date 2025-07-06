import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../hooks/useAuth";
import { ActivityIndicator, View } from "react-native";

import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import HomeScreen from "../screens/Main/HomeScreen";

import {
  AuthStackParamList,
  HomeStackParamList,
  NotificationStackParamList,
  ProfileStackParamList,
  SearchStackParamList,
  TabParamList,
} from "../types/navigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProductDetailScreen from "../screens/Main/ProductDetailScreen";
import ProfileScreen from "../screens/Main/ProfileScreen";
import SettingsScreen from "../screens/Main/SettingsScreen";
import NotificationScreen from "../screens/Main/NotificationScreen";
import SearchScreen from "../screens/Main/SearchScreen";
import ProductListScreen from "../screens/Main/ProductListScreen";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const NotificationStack =
  createNativeStackNavigator<NotificationStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const HomeNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: "Trang chủ" }}
    />
    <HomeStack.Screen
      name="Detail"
      component={ProductDetailScreen}
      options={{ title: "Chi tiết sản phẩm" }}
    />
  </HomeStack.Navigator>
);

const ProfileNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: "Thông tin cá nhân" }}
    />
    <ProfileStack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: "Cài đặt" }}
    />
  </ProfileStack.Navigator>
);

const NotificationNavigator = () => (
  <NotificationStack.Navigator>
    <NotificationStack.Screen
      name="Notification"
      component={NotificationScreen}
      options={{ title: "Thông báo" }}
    />
    <NotificationStack.Screen
      name="Detail"
      component={ProductDetailScreen}
      options={{ title: "Chi tiết sản phẩm" }}
    />
  </NotificationStack.Navigator>
);

const SearchNavigator = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen
      name="Search"
      component={SearchScreen}
      options={{ title: "Tìm kiếm" }}
    />
    <SearchStack.Screen
      name="ProductList"
      component={ProductListScreen}
      options={{ title: "Kết quả tìm kiếm" }}
    />
    <SearchStack.Screen
      name="Detail"
      component={ProductListScreen}
      options={{ title: "Chi tiết sản phẩm" }}
    />
  </SearchStack.Navigator>
);

const BottomTab = () => (
  <Tab.Navigator screenOptions={{headerShown: false}}>
    <Tab.Screen
      name="Home"
      component={HomeNavigator}
      options={{ title: "Trang chủ" }}
    />
    <Tab.Screen
      name="Search"
      component={SearchNavigator}
      options={{ title: "Tìm kiếm" }}
    />
    <Tab.Screen
      name="Notification"
      component={NotificationNavigator}
      options={{ title: "Thông báo" }}
    />
    <Tab.Screen
      name="Profile"
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
      {/* {accessToken ? <BottomTab /> : <AuthNavigator />} */}
      {<BottomTab />}
    </NavigationContainer>
  );
};
