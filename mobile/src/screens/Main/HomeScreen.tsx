import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../../hooks/useAuth";

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chào mừng trở lại,</Text>
      <Text style={styles.name}>{user?.first_name || "Người dùng"}!</Text>
      <Button title="Đăng xuất" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
