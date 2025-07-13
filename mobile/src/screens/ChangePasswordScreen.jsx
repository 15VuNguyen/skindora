import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import usePut from "../hooks/common/usePut";
import LoadingScreen from "./LoadingScreen";
import usePost from "../hooks/common/usePost";
import { clearTokens } from "../utils/tokenStorage";
import { useNavigation } from "@react-navigation/native";

export default function ChangePasswordScreen() {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { post: postVerifyEmail, loading: verifying } = usePost(
    "/users/resend-verify-email"
  );

  const { put, loading } = usePut("/users/change-password");
  const navigate = useNavigation();

  const handleSubmit = async () => {
    if (!oldPassword || !password || !confirmPassword) {
      return Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
    }

    if (oldPassword.length < 8 || oldPassword.length > 30) {
      return Alert.alert(
        "Lỗi",
        "Mật khẩu cũ phải độ dài ít nhất 8 ký tự và dài nhất 30 ký tự"
      );
    }

    if (password.length < 8 || password.length > 30) {
      return Alert.alert(
        "Lỗi",
        "Mật khẩu mới phải độ dài ít nhất 8 ký tự và dài nhất 30 ký tự"
      );
    }

    if (password.length < 6) {
      return Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự.");
    }

    if (password !== confirmPassword) {
      return Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
    }

    try {
      const res = await put({
        old_password: oldPassword,
        password,
        confirm_password: confirmPassword,
      });
      await clearTokens();
      Alert.alert("Thành công", res?.message || "Đổi mật khẩu thành công!");
      setOldPassword("");
      setPassword("");
      setConfirmPassword("");
      navigate.navigate("HomeTab");
    } catch (err) {
      const msg = err?.response?.data?.message || "Đổi mật khẩu thất bại.";
      if (msg.toLowerCase().includes("not verified")) {
        Alert.alert("Lỗi", msg, [
          {
            text: "Xác thực ngay",
            onPress: () => {
              (async () => {
                try {
                  const res = await postVerifyEmail();
                  Alert.alert(
                    "Thông báo",
                    res?.message || "Đã gửi email xác thực!"
                  );
                } catch (err) {
                  Alert.alert(
                    "Lỗi",
                    err?.response?.data?.message || "Gửi thất bại!"
                  );
                }
              })();
            },
          },
          { text: "Đóng", style: "cancel" },
        ]);
      } else {
        Alert.alert("Lỗi", msg);
      }
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Đổi mật khẩu</Text>

        <Text style={styles.label}>Mật khẩu hiện tại</Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder="Nhập mật khẩu cũ"
          value={oldPassword}
          onChangeText={setOldPassword}
        />

        <Text style={styles.label}>Mật khẩu mới</Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder="Nhập mật khẩu mới"
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Xác nhận mật khẩu</Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#B197FC",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
