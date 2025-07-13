import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function EditRecipientScreen({ route, navigation }) {
  const { recipientInfo, setRecipientInfo } = route.params;

  const [name, setName] = useState(recipientInfo?.name || "");
  const [phone, setPhone] = useState(recipientInfo?.phone || "");
  const [address, setAddress] = useState(recipientInfo?.address || "");

  const handleSave = () => {
    if (!name || !phone || !address) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    console.log({ name, phone, address })
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
        value={address}
        onChangeText={setAddress}
        style={[styles.input, { height: 80 }]}
        multiline
        placeholder="Nhập địa chỉ nhận hàng"
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
