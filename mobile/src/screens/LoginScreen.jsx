import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Ionicons } from "@expo/vector-icons";
import FloatingLabelInput from "../components/FloatingLabelInput";
import { useAuth } from "../hooks/useAuth";

WebBrowser.maybeCompleteAuthSession();
const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, googleLogin } = useAuth();
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: Platform.OS === "ios" ? iosClientId : undefined,
    androidClientId: Platform.OS === "android" ? androidClientId : undefined,
  });

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === "success") {
        const { authentication } = response;
        if (authentication?.accessToken) {
          Alert.alert(
            "Lưu ý",
            "Flow Google OAuth cần điều chỉnh ở backend để nhận access token thay vì code."
          );
        }
      } else if (response?.type === "error") {
        Alert.alert(
          "Đăng nhập Google thất bại",
          response.error?.message || "Có lỗi xảy ra."
        );
      }
    };
    handleGoogleResponse();
  }, [response]);

  const handleLogin = async () => {
    try {
      setErrors({});
      await login({ email, password });
    } catch (error) {
      console.log("login error: ", error.response)
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        const extractedErrors = {};
        for (const key in serverErrors) {
          extractedErrors[key] = serverErrors[key].msg;
        }
        setErrors(extractedErrors);
      } else {
        Alert.alert(
          "Đăng nhập thất bại",
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại."
        );
      }
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
              <Text style={styles.title}>Skindora Welcome</Text>
              <Ionicons name="leaf-outline" size={36} color="#10b981" />
            </View>

            <FloatingLabelInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <FloatingLabelInput
              label="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>

            <View style={styles.separator}>
              <View style={styles.line} />
              <Text style={styles.separatorText}>hoặc</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={() => promptAsync()}
              disabled={!request}
            >
              <Text style={styles.googleButtonText}>Đăng nhập với Google</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text>Chưa có tài khoản?</Text>
              <Text
                style={styles.link}
                onPress={() => navigation.navigate("Register")}
              >
                {" "}
                Đăng ký ngay
              </Text>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
//styles
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

  loginButton: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  googleButton: {
    backgroundColor: "#DB4437",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  googleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  separatorText: {
    marginHorizontal: 8,
    color: "#6b7280",
    fontSize: 14,
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
