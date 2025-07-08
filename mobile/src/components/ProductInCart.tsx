import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../types/product";

type Props = {
  item: Product;
  selected: string[];
  onPress: (id: string) => void;
  updateQuantity: (id: string, change: number) => void;
  toggleSelect?: (id: string) => void;
};

const ProductInCart = ({
  item,
  selected,
  onPress,
  updateQuantity,
  toggleSelect,
}: Props) => {
  const isSelecting = selected.length > 0;
  const isSelected = selected.includes(item.id);

  return (
    <TouchableWithoutFeedback
      onLongPress={() => toggleSelect?.(item.id)}
      onPress={() => onPress(item.id)}
    >
      <View
        style={[styles.productItem, isSelected && styles.selectedBackground]}
      >
        {isSelecting && (
          <View style={styles.checkboxContainer}>
            <Ionicons
              name={isSelected ? "checkbox" : "square-outline"}
              size={24}
              color={isSelected ? "#10b981" : "#9ca3af"}
            />
          </View>
        )}
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>
              {item.price.toLocaleString()} đ
            </Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => updateQuantity(item.id, -1)}
                style={styles.quantityBtn}
              >
                <Text>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.quantityInput}
                value={item.quantity.toString()}
                onChangeText={(text) =>
                  updateQuantity(item.id, parseInt(text) - item.quantity || 0)
                }
                keyboardType="numeric"
              />
              <TouchableOpacity
                onPress={() => updateQuantity(item.id, 1)}
                style={styles.quantityBtn}
              >
                <Text>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  productItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    alignItems: "center",
    maxHeight: 100,
    borderRadius: 8,
  },
  selectedBackground: {
    backgroundColor: "#d1fae5", // xanh nhạt khi được chọn
  },
  checkboxContainer: {
    marginRight: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  productDetails: {
    height: "100%",
    flex: 1,
    marginLeft: 10,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  productName: { fontSize: 14, color: "#333" },
  productFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productPrice: {
    fontSize: 14,
    color: "#ff4444",
    fontWeight: "bold",
    marginVertical: 5,
  },
  quantityContainer: { flexDirection: "row", alignItems: "center" },
  quantityBtn: {
    flexDirection: "row",
    justifyContent: "center",
    width: 25,
    backgroundColor: "#ddd",
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityInput: {
    width: 40,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 5,
  },
});

export default ProductInCart;
