import { SafeAreaView } from "react-native-safe-area-context";
import ProductListScreen from "./ProductListScreen";
import { useRoute } from "@react-navigation/native";

export default function HomeScreen() {
  const route = useRoute();
  const search = route.params?.search || "";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <ProductListScreen searchFromParam={search} />
    </SafeAreaView>
  );
}``
