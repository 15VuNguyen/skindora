import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import privateAxios from "../utils/axiosPrivate";
import { voucherEndpoints } from "../config/api";
import { useEffect, useState } from "react";
import {
  CommonActions,
} from "@react-navigation/native";

const VoucherApplicationScreen = ({ navigation, route }) => {
  const { selectedVoucher, selectedPaymentMethod, cart, recipientInfo } = route.params || {};
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVouchers = async () => {
    try {
      const { data } = await privateAxios.get(voucherEndpoints.list);
      setVouchers(data.data || []);
    } catch (err) {
      console.error("Failed to fetch vouchers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const getPreviousScreen = () => {
    const routes = navigation.getState()?.routes;
    const currentRouteIndex = routes.findIndex(
      (r) => r.name === "VoucherApplication"
    );
    if (currentRouteIndex > 0) {
      return routes[currentRouteIndex - 1].name;
    }
    return "Cart";
  };

  const handleSelectVoucher = (voucher) => {
    const previousScreen = getPreviousScreen();
    if (previousScreen === "Cart") {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: previousScreen,
              params: {
                selectedVoucher: voucher,
                selectedPaymentMethod,
                cart,
              },
            },
          ],
        })
      );
    } else {
      navigation.dispatch((state) => {
        const newRoutes = state.routes.slice(0, -2); // xoá Voucher + Checkout ra khỏi stack
        return CommonActions.reset({
          ...state,
          routes: [
            ...newRoutes,
            {
              name: previousScreen,
              params: {
                selectedVoucher: voucher,
                selectedPaymentMethod,
                cart,
                recipientInfo
              },
            },
          ],
          index: newRoutes.length, // trỏ vô screen checkout mới
        });
      });
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00C897" />
      ) : (
        <FlatList
          data={vouchers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const isSelected = selectedVoucher?._id === item._id;
            return (
              <TouchableOpacity
                style={[
                  styles.voucherItem,
                  isSelected && styles.voucherItemSelected,
                ]}
                onPress={() => handleSelectVoucher(item)}
              >
                <Text
                  style={[
                    styles.voucherCode,
                    isSelected && styles.voucherTextSelected,
                  ]}
                >
                  {item.code}
                </Text>
                <Text
                  style={[
                    styles.voucherName,
                    isSelected && styles.voucherTextSelected,
                  ]}
                >
                  {item.description}
                </Text>
                <Text
                  style={[
                    styles.conditionText,
                    isSelected && styles.voucherTextSelected,
                  ]}
                >
                  {item.minOrderValue
                    ? `Áp dụng cho đơn từ ${item.minOrderValue.toLocaleString()}đ`
                    : "Không yêu cầu giá trị tối thiểu"}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
  voucherItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  voucherCode: { fontWeight: "bold", fontSize: 16, color: "#ef4444" },
  voucherName: { marginTop: 5, color: "#374151" },
  conditionText: { marginTop: 5, fontSize: 12, color: "#6b7280" },
  voucherItemSelected: {
    backgroundColor: "#10b981",
    borderColor: "#059669",
  },

  voucherTextSelected: {
    color: "#fff",
  },
});

export default VoucherApplicationScreen;
