import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Keyboard,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import useFetch from "../hooks/common/useFetch";
import {
  getSearchHistory,
  addSearchHistory,
} from "../utils/searchHistory";
import debounce from "lodash.debounce";

export default function SearchScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);

  const { data, loading, error, refetch } = useFetch(
    "/products/get-all",
    false,
    true,
    searchParams
  );

  const visibleData = showAll ? data || [] : (data || []).slice(0, 5);

  const debouncedSearch = useRef(
    debounce((text) => {
      const trimmed = text.trim();
      if (trimmed) {
        setSearchParams({ page: 1, limit: 12, q: trimmed });
      }
    }, 500)
  ).current;

  useEffect(() => {
    inputRef.current?.focus();
    loadHistory();
    return () => debouncedSearch.cancel();
  }, []);

  useEffect(() => {
    if (searchParams) {
      refetch(searchParams);
    }
  }, [searchParams]);

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  const loadHistory = async () => {
    const list = await getSearchHistory();
    setHistory(list);
  };

  const handleSearch = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    addSearchHistory(trimmed);
    Keyboard.dismiss();
    navigation.navigate("Home", { search: trimmed });
  };

  const handleSelectHistory = (text) => {
    setQuery(text);
    handleSearch(text);
  };

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectHistory(item)}>
      <Text style={styles.historyItem}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#333" />
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Tìm kiếm sản phẩm..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={() => handleSearch(query)}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length > 0 && !query && (
        <View style={{ marginTop: 10, paddingHorizontal: 16 }}>
          <Text style={styles.historyTitle}>Lịch sử tìm kiếm</Text>
          <FlatList
            data={history}
            keyExtractor={(item, index) => item + index}
            renderItem={renderHistoryItem}
          />
        </View>
      )}

      <FlatList
        data={visibleData}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItemContainer}
            onPress={() => navigation.navigate("Detail", { id: item._id })}
          >
            <Image
              source={{ uri: item.image_on_list }}
              style={styles.resultImage}
            />
            <Text numberOfLines={1} style={styles.resultItem}>
              {item.name_on_list}
            </Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          !showAll && (data?.length || 0) > 5 ? (
            <TouchableOpacity onPress={() => setShowAll(true)}>
              <Text style={styles.loadMore}>Xem thêm</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 999,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 16,
    height: 44,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  resultItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultItem: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
    flexShrink: 1,
  },
  resultImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    resizeMode: "cover",
  },
  historyItem: {
    paddingVertical: 10,
    fontSize: 16,
    color: "#444",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  historyTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 8,
    color: "#666",
  },
  loadMore: {
    textAlign: "center",
    paddingVertical: 12,
    fontSize: 15,
    color: "#007AFF",
  },
  clearText: {
    fontSize: 18,
    color: "#888",
    marginLeft: 10,
  },
});
