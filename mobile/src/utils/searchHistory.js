import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "SEARCH_HISTORY";

export const getSearchHistory = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.log("Error getting history: ", e);
    return [];
  }
};

export const addSearchHistory = async (term) => {
  if (!term) return;
  try {
    const history = await getSearchHistory();
    const newHistory = [term, ...history.filter((item) => item !== term)].slice(
      0,
      10
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  } catch (e) {
    console.log("Error saving search term", e);
  }
};

export const clearSearchHistory = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.log("Error clearing search history", e);
  }
};
