import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function BulkActionsBar({
  products,
  setSelected,
  confirmDelete,
}) {
  return (
    <View style={styles.bar}>
      {products.length > 1 && (
        <TouchableOpacity
          onPress={() => setSelected(products.map((p) => p.ProductID))}
        >
          <Text style={styles.allTxt}>Chọn tất cả</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={confirmDelete}>
        <Text style={styles.delTxt}>Xóa khỏi giỏ hàng</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSelected([])}>
        <Text style={styles.cancelTxt}>Huỷ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff7ed",
  },
  allTxt: { color: "#f97316", fontWeight: "bold" },
  delTxt: { color: "#ef4444", fontWeight: "bold" },
  cancelTxt: { color: "#555", fontWeight: "bold" },
});
