import { serverUrl } from "../constants/config";
import React from "react";
import { useAuth } from "./auth";
import { event } from "react-native-reanimated";
import { storage } from "../utils/store";
import { showToast } from "../utils/utils";
import Url from "url-parse"


interface myWebSocketOption {
    wsUrl: string,
    options?: {
        headers: {[headerName: string]: string};
        [optionName: string]: any;
      } | null, 
    onopen: (() => void) | null;
    onmessage: ((event: Event) => void) | null;
    onerror: ((event: Event) => void) | null;
    onclose: ((event: Event) => void) | null;
}

interface authWebSocketValues {
  authWebSocket: (option: myWebSocketOption) => Promise<WebSocket>;
}

const authWebSocketConext = React.createContext<null | authWebSocketValues>(null);

export const useAuthWebSocket = () => {
    return React.useContext(authWebSocketConext)
}


export const AuthWebSocketProvider = (props: { children: React.ReactNode }) => {
    const authContext = useAuth()
    const MyWebSocket = async ({
        wsUrl,
        onclose,
        onerror,
        onmessage,
        onopen,
        options
    }: myWebSocketOption) => {
        const myOnClose = (event: WebSocketCloseEvent) => {
            onclose?.(event)
            if(event.code == 1012){
                showToast("未登录", "fail")
                authContext?.signOut()
            }
        }
        const jwtToken = await storage.get("jwt-token")
        const urlObj = new Url(wsUrl, true)
        urlObj.query.Authorization = jwtToken ?? ""
        const webSocketInstance = new WebSocket(urlObj.toString())
        webSocketInstance.onclose = myOnClose
        webSocketInstance.onerror = onerror
        webSocketInstance.onmessage = onmessage
        webSocketInstance.onopen = onopen
        return webSocketInstance
    }
    return <authWebSocketConext.Provider value={{
        authWebSocket: MyWebSocket
    }}>
        {props.children}
    </authWebSocketConext.Provider>

}
