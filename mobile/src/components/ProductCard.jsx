import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";

const ProductCard = ({ product, onPress, style }) => {
  return (
    <Pressable style={[styles.card, style]} onPress={onPress}>
      <Image source={{ uri: product.image_on_list }} style={styles.image} />
      <Text style={styles.name}>{product.name_on_list}</Text>
      <Text style={styles.engName}>{product.engName_on_list}</Text>
      <Text style={styles.price}>
        {Number(product.price_on_list).toLocaleString("vi-VN")} ₫
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  image: {
    height: 150,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  engName: {
    fontSize: 12,
    color: "#666",
  },
  price: {
    marginTop: 4,
    fontSize: 14,
    color: "#e91e63",
    fontWeight: "bold",
  },
});

export default ProductCard;
