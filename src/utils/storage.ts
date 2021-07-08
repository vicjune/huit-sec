import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_PLAYERS_KEY = '@playerNames';
export const STORAGE_VICTORY_KEY = '@victoryScore';
export const STORAGE_TIMER_KEY = '@timerValue';
export const STORAGE_QUESTIONS_SEEN_KEY = '@questionsSeen';
export const STORAGE_PERMANENT_QUESTIONS_SEEN_KEY = '@permanentQuestionsSeen';

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
