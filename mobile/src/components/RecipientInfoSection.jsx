import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAuth } from "../hooks/useAuth";
import { useCallback } from "react";

export default function RecipientInfoSection({
  recipientInfo,
  setRecipientInfo,
}) {
  const { user } = useAuth();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(()=>{
      console.log(recipientInfo) 
    })
  )

  return (
    <TouchableOpacity
      style={styles.recipientSection}
      onPress={() =>
        navigation.navigate("EditRecipient", {
          recipientInfo,
          setRecipientInfo, 
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.iconWrapper}>
        <Ionicons name="location-sharp" size={24} color="#e11d48" />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.namePhoneRow}>
          <Text style={styles.recipientName}>{user.first_name}</Text>
          <Text style={styles.recipientPhone}>{user.phone_number}</Text>
        </View>
        <Text style={styles.recipientAddress} numberOfLines={2}>
          {user.location}
        </Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  recipientSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#fff0f1",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  iconWrapper: {
    marginRight: 12,
    padding: 8,
    backgroundColor: "#fee2e2",
    borderRadius: 30,
  },
  namePhoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  recipientName: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#111827",
    marginRight: 12,
  },
  recipientPhone: {
    fontSize: 14,
    color: "#4b5563",
  },
  recipientAddress: {
    fontSize: 14,
    color: "#6b7280",
  },
});
