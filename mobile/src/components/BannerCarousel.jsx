import React from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const banners = [
  {
    id: 1,
    image: {
      uri: "https://amis.misa.vn/wp-content/uploads/2024/10/Template-Blog-CRM-900x500-8.jpg",
    },
  },
  {
    id: 2,
    image: {
      uri: "https://amis.misa.vn/wp-content/uploads/2024/10/Template-Blog-CRM-900x500-11-1024x569.jpg",
    },
  },
  {
    id: 3,
    image: {
      uri: "https://amis.misa.vn/wp-content/uploads/2024/10/Template-Blog-CRM-900x500-9-1-1024x569.jpg",
    },
  },
];

const { width } = Dimensions.get("window");

export default function BannerCarousel() {
  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={width}
        height={160}
        autoPlay={true}
        data={banners}
        scrollAnimationDuration={2000}
        autoPlayInterval={4000}
        renderItem={({ item }) => (
          <Image source={item.image} style={styles.image} resizeMode="cover" />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 10,
  },
});
