import React, { useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";

const OrderSuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params;

  const isFirstRender = useRef(true);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (!isFirstRender.current) {
          navigation.navigate("CartTab", {
            screen: "Cart",
            params: {},
          });

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Cart" }],
            })
          );
        }
        isFirstRender.current = false;
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="checkmark-circle-outline" size={100} color="#10b981" />
      <Text style={styles.title}>Đặt hàng thành công!</Text>
      <Text style={styles.subtitle}>Cảm ơn bạn đã mua hàng tại Skindora.</Text>
      <Text style={styles.orderId}>Mã đơn hàng: {orderId}</Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("HomeTab")}
        >
          <Text style={styles.primaryText}>Về trang chủ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            navigation.navigate("ProfileTab", { screen: "Orders" })
          }
        >
          <Text style={styles.secondaryText}>Xem đơn hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OrderSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#10b981",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 8,
    textAlign: "center",
  },
  orderId: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 12,
  },
  buttonGroup: {
    marginTop: 32,
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#e11d48",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderColor: "#e11d48",
    borderWidth: 1,
    alignItems: "center",
  },
  secondaryText: {
    color: "#e11d48",
    fontSize: 15,
    fontWeight: "500",
  },
});
