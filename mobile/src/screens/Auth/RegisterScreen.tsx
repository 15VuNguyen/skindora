import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FloatingLabelInput from "../../components/FloatingLabelInput";
import { useAuth } from "../../hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation();
  const { register } = useAuth();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp.");
      return;
    }

    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        confirm_password: confirmPassword,
      });
    } catch (error: any) {
      Alert.alert(
        "Đăng ký thất bại",
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Skindora</Text>
              <Ionicons name="person-add-outline" size={30} color="#10b981" />
            </View>

            <FloatingLabelInput label="Họ" value={lastName} onChangeText={setLastName} />
            <FloatingLabelInput label="Tên" value={firstName} onChangeText={setFirstName} />
            <FloatingLabelInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <FloatingLabelInput
              label="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <FloatingLabelInput
              label="Xác nhận mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Đăng ký</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text>Đã có tài khoản?</Text>
              <Text style={styles.link} onPress={() => navigation.goBack()}>
                {" "}
                Đăng nhập
              </Text>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#fdfdfd",
  },
  container: {
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
  },
  registerButton: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  link: {
    color: "#10b981",
    fontWeight: "600",
  },
});
