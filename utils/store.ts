import constant from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

export const storage = {
    get: async(key: string) => {
        if(constant.platform?.ios){
            return await SecureStore.getItemAsync(key)
          }else if(constant.platform?.web){
            return localStorage.getItem(key)
          }
    },
    set:async (key: string, value: string) => {
        if(constant.platform?.ios){
            return await SecureStore.setItemAsync(key, value)
          }else if(constant.platform?.web){
            return localStorage.setItem(key, value)
          }
    }
}