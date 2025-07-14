import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as Location from "expo-location";

export default function EditRecipientScreen({ route, navigation }) {
  const { recipientInfo, setRecipientInfo } = route.params;

  const [name, setName] = useState(recipientInfo?.name || "");
  const [phone, setPhone] = useState(recipientInfo?.phone || "");
  const [address, setAddress] = useState(recipientInfo?.address || "");
  const [loading, setLoading] = useState(false);

  // Hàm lấy vị trí hiện tại và chuyển đổi thành địa chỉ
  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;

      let addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addressResponse.length > 0) {
        const { streetNumber, street, city, region, country, postalCode } =
          addressResponse[0];
        const formattedAddress = [
          streetNumber,
          street,
          city,
          region,
          country,
          postalCode,
        ]
          .filter(Boolean)
          .join(", ")
          .trim();
        setAddress(formattedAddress || "Không thể xác định địa chỉ cụ thể");
      } else {
        Alert.alert("Lỗi", "Không thể lấy địa chỉ từ vị trí hiện tại.");
      }
    } catch (error) {
      Alert.alert(
        "Lỗi",
        "Không thể lấy vị trí hiện tại. Vui lòng kiểm tra cài đặt vị trí."
      );
      console.error("Lỗi khi lấy vị trí:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tự động lấy vị trí khi màn hình được load
  useEffect(() => {
    if (!recipientInfo?.address) {
      getCurrentLocation();
    }
  }, []);

  const handleSave = () => {
    if (!name || !phone || !address) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    setRecipientInfo({ name, phone, address });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin người nhận</Text>

      <Text style={styles.label}>Họ tên</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Nhập họ tên"
      />

      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="Nhập số điện thoại"
      />

      <Text style={styles.label}>Địa chỉ</Text>
      <TextInput
        value={loading ? "Đang lấy vị trí..." : address}
        onChangeText={setAddress}
        style={[styles.input, { height: 80 }]}
        multiline
        placeholder="Nhập địa chỉ nhận hàng"
        editable={!loading} // Vô hiệu hóa khi đang tải
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e11d48",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: "#f9fafb",
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: "#e11d48",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
