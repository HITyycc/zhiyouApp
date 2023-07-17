import constant from "expo-constants";
import * as SecureStore from "expo-secure-store";

export const storage = {
  get: async (key: string) => {
    if (constant.platform?.web) {
      return localStorage.getItem(key);
    } else {
      //(constant.platform?.ios)
      return await SecureStore.getItemAsync(key);
    }
  },
  set: async (key: string, value: string) => {
    if (constant.platform?.web) {
      return localStorage.setItem(key, value);
    }else  { //(constant.platform?.ios)
      return await SecureStore.setItemAsync(key, value);
    }
  },
  delete: async (key: string) => {
    if (constant.platform?.web) {
      return localStorage.removeItem(key);
    }else { //(constant.platform?.ios)
      return await SecureStore.deleteItemAsync(key);
    }  
  },
};
