import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useFetch from "../hooks/common/useFetch";
import usePost from "../hooks/common/usePost";
import LoadingScreen from "./LoadingScreen";

const defaultAvatar =
  "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png";

export default function UserProfileScreen() {
  const {
    data: user,
    loading,
    error,
    refetch,
  } = useFetch("/users/me", true, false);
  const { post: postVerifyEmail, loading: verifying } = usePost(
    "/users/resend-verify-email"
  );

  const handleVerifyEmail = async () => {
    try {
      const res = await postVerifyEmail();
      Alert.alert("Thông báo", res?.message || "Đã gửi email xác thực!");
      refetch();
    } catch (err) {
      Alert.alert("Lỗi", err?.response?.data?.message || "Gửi thất bại!");
    }
  };

  if (loading) return <LoadingScreen />;
  if (error || !user) return <Text style={styles.error}>Lỗi tải dữ liệu</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Avatar */}
        <Image
          source={{ uri: user.avatar || defaultAvatar }}
          style={styles.avatar}
        />

        {/* Tên */}
        <Text style={styles.name}>
          {user.first_name} {user.last_name}
        </Text>

        {/* Thông tin chi tiết */}
        <View style={styles.infoSection}>
          <InfoItem label="Email" value={user.email} />
          <InfoItem label="Tên đăng nhập" value={user.username} />
          <InfoItem
            label="Số điện thoại"
            value={user.phone_number || "Chưa cập nhật"}
          />
          <InfoItem
            label="Ngày tạo"
            value={new Date(user.created_at).toLocaleDateString("vi-VN")}
          />
          <InfoItem
            label="Đã xác minh"
            value={user.verify ? "Đã xác minh" : "Chưa xác minh"}
          />
          <InfoItem
            label="Vai trò"
            value={user.roleid === 1 ? "Admin" : "Người dùng"}
          />
        </View>

        {/* Nút xác minh nếu chưa xác minh */}
        {!user.verify && (
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerifyEmail}
            disabled={verifying}
          >
            <Text style={styles.verifyButtonText}>
              {verifying ? "Đang gửi..." : "Xác thực email"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

function InfoItem({ label, value }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: "#ddd",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
  },
  infoSection: {
    width: "100%",
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoLabel: {
    fontWeight: "500",
    color: "#555",
  },
  infoValue: {
    color: "#000",
    fontWeight: "600",
    maxWidth: "60%",
    textAlign: "right",
  },
  verifyButton: {
    backgroundColor: "#B197FC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  verifyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loading: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  error: {
    textAlign: "center",
    color: "red",
    marginTop: 50,
    fontSize: 16,
  },
});
