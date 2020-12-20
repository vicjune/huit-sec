import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  set(key: string, value: any) {
    try {
      const jsonValue = JSON.stringify(value);
      return AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      return Promise.resolve();
    }
  },

  async get<T>(key: string) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
    } catch (e) {
      return Promise.resolve(null);
    }
  },

  remove(key: string) {
    try {
      return AsyncStorage.removeItem(key);
    } catch (e) {
      return Promise.resolve();
    }
  },
};
