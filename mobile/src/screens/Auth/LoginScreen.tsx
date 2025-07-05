import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
  EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
} from "@env";
import { useAuth } from "../../hooks/useAuth";
import { AuthStackParamList } from "../../types/navigation";

WebBrowser.maybeCompleteAuthSession();

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, googleLogin } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    androidClientId: EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
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
      await login({ email, password });
    } catch (error: any) {
      Alert.alert(
        "Đăng nhập thất bại",
        error.response?.data?.message || "Email hoặc mật khẩu không đúng."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập Skindora</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Đăng nhập" onPress={handleLogin} />
      <View style={styles.separator} />
      <Button
        title="Đăng nhập với Google"
        onPress={() => {
          promptAsync();
        }}
        color="#DB4437"
        disabled={!request}
      />
      <View style={styles.footer}>
        <Text>Chưa có tài khoản?</Text>
        <Text
          style={styles.link}
          onPress={() => navigation.navigate("Register")}
        >
          Đăng ký ngay
        </Text>
      </View>
    </View>
  );
}
//styles
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  separator: { marginVertical: 10 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  link: { color: "blue", marginLeft: 5 },
});
