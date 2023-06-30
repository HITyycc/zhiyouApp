import { useRouter, useSegments } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import React from "react";
import { utils } from "../utils";
import constant from 'expo-constants';
import { storage } from "../utils/store";

interface authContextValues {
  signIn: (userInfo: jwtUserInfo) => void,
  signOut: () => void,
  user: userInfoType
}


type userInfoType = jwtUserInfo | null

const AuthContext = React.createContext<authContextValues | null>(null);

export function useAuth() {
    return React.useContext(AuthContext);
}

function useProtectedRoute(user: userInfoType) {
    const segments = useSegments();
    const router = useRouter();

    React.useEffect(() => {
        const inAuthGroup = segments[0] === "(auth)";
        if (
        // If the user is not signed in and the initial segment is not anything in the auth group.
        !user &&
        !inAuthGroup
        ) {
        // Redirect to the sign-in page.
        router.replace("/welcome");
        } else if (user && inAuthGroup) {
        // Redirect away from the sign-in page.
        router.replace("/");
        }
    }, [user, segments]);
}

export function AuthProvider(props: { children: React.ReactNode }) {
    const [user, setAuth] = React.useState<userInfoType>({
      userId: "null",
      nickname: "null",
      avatarUrl: "null"
    });
    
    React.useEffect(() => {
      (async () => {
        let jwtToken = null
        if(constant.platform?.ios){
          jwtToken = await SecureStore.getItemAsync("jwt-token")
        }else if(constant.platform?.web){
          jwtToken = localStorage.getItem("jwt-token")
        }
        if( jwtToken === null) {
          setAuth(null)
        }else{
          jwtToken = jwtToken.split(".")[1]
          const jwtObj = JSON.parse(utils.base64ToUtf8(jwtToken))
          const userData: jwtUserInfo = {
            userId: jwtObj.userId,
            avatarUrl: jwtObj.avatarUrl,
            nickname: jwtObj.nickname
          }
          setAuth(userData)
        }
        // 
      })()
    }, [])
  
    useProtectedRoute(user);
    return (
      <AuthContext.Provider
        value={{
          signIn: (userInfo: jwtUserInfo) => setAuth(userInfo),
          signOut: () => {
            storage.delete("jwt-token")
            setAuth(null)
          },
          user,
        }}
      >
        {props.children}
      </AuthContext.Provider>
    );
  }