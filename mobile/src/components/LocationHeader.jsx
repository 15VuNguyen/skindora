import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { MapPin } from "lucide-react-native";

export default function LocationHeader() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocation("Quyền bị từ chối");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const geocode = await Location.reverseGeocodeAsync(loc.coords);
        const place = geocode[0];
        const formatted = `${place.name || ""}, ${place.street || ""}, ${
          place.city || place.district || ""
        }`;
        setLocation(formatted);
      } catch (err) {
        setLocation("Không thể lấy vị trí");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapPin size={20} color="#00C897" style={{ marginRight: 8 }} />
      {loading ? (
        <ActivityIndicator size="small" color="#888" />
      ) : (
        <TouchableOpacity style={{ flex: 1 }}>
          <View>
            <Text style={styles.label}>Your Location</Text>
            <Text style={styles.location}>{location}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
});
