// Cross-platform storage utility (works on web and mobile)

class Storage {
  async getItem(key: string): Promise<string | null> {
    if (typeof window !== 'undefined') {
      // Web
      return localStorage.getItem(key);
    } else {
      // Mobile
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      return AsyncStorage.default.getItem(key);
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    if (typeof window !== 'undefined') {
      // Web
      localStorage.setItem(key, value);
    } else {
      // Mobile
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.default.setItem(key, value);
    }
  }

  async removeItem(key: string): Promise<void> {
    if (typeof window !== 'undefined') {
      // Web
      localStorage.removeItem(key);
    } else {
      // Mobile
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.default.removeItem(key);
    }
  }
}

export const storage = new Storage();
