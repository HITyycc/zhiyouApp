import React, { useReducer } from "react";
import { useAuthAxios } from "./../authAxiosProvider";
import {
  Keyboard,
  TextInput as RNTextInput,
  ScrollView,
  TextInput as RNInput,
} from "react-native";
import { storage } from "../../utils/store";
import { useAuth } from "./../auth";
import EventSource, {
  EventSourceListener,
  ErrorEvent as sseErrorEvent,
  MessageEvent as sseMessageEvent,
} from "react-native-sse";
import {
  chatContent,
  actionType,
  chatContentListReducer,
  initChatListHook,
  sseHook,
} from "./chatRoomHook";
import { Buffer } from "buffer"

import { Audio } from "expo-av";
import { showToast } from "../../utils/utils";
import * as FileSystem from "expo-file-system";
import { useAuthWebSocket } from "../authWebsocket";

interface chatProviderValues {
  chatId: string;
  chatContentList: Array<chatContent>;
  dispatch: React.Dispatch<actionType>;
  scrollViewRef: React.RefObject<ScrollView>;
  loadingMessage: string;
  isLoadingMessage: boolean;
  handleSendMessage: (message: string) => void;
  es: EventSource | null;
  handleSpeechStart: () => void;
  useSpeech: boolean;
  keyboardHeight: number;
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
  textValue: string;
  textInputRef: React.RefObject<RNInput>;
  handleSpeechEnd: () => void;
  textInputDisable: boolean;
  setTextInputDisable: React.Dispatch<React.SetStateAction<boolean>>;
  volume: number;
}

const chatContext = React.createContext<null | chatProviderValues>(null);

export const useChatContext = () => {
  return React.useContext(chatContext);
};

export const ChatContextProvider = (props: {
  children: React.ReactNode;
  chatId: string;
}) => {
  const [chatContentList, dispatch] = useReducer(chatContentListReducer, []);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const authAxios = useAuthAxios();
  const [loadingMessage, setLoadingMessage] = React.useState("");
  const [isLoadingMessage, setIsLoadingMessage] = React.useState(false);

  const [es, setEs] = React.useState<EventSource | null>(null);
  const [useSpeech, setUseSpeech] = React.useState(false);
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  const textInputRef = React.useRef<RNInput | null>(null);
  const [textValue, setTextValue] = React.useState("");
  const [recording, setRecoding] = React.useState<Audio.Recording>();
  const [textInputDisable, setTextInputDisable] = React.useState(false);
  const [recordStart, setRecordStart] = React.useState(0);
  
  // -160~0
  const [volume, setVolume] = React.useState(-160);
  const [ws, setWs] = React.useState<WebSocket>();
  const authWebSocket = useAuthWebSocket();
  const [sentence, setSentence] = React.useState<Array<string>>([])

  React.useEffect(() => {
    const value = sentence.join("")
    if(value.length != 0){
      setTextValue(value)
    }
    // setTextInputSelectionStart(value.length)
    // setTextInputSelectionEnd(value.length)
    
  }, [sentence])

  const handleSpeechStart = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        if (!permission.canAskAgain) {
          showToast("请去手机授予APP录音权限", "fail");
        }
        return;
      }
      setTextInputDisable(true);
      setUseSpeech(true);
      Keyboard.dismiss();
      
      const wsConnect = await authWebSocket?.authWebSocket({
        wsUrl: `ws://10.249.41.229:3010/ws/speech2text`,
        onclose: (event: WebSocketCloseEvent) => {
          setSentence([])
          if(event.code == 1013){
            showToast("语音识别服务错误", "fail")
            handleSpeechEnd()
            // setTextValue(pre => {
            //   setTextInputSelectionStart(1)
            //   setTextInputSelectionEnd(pre.length)
            //   return pre
            // })
          }
          console.log("close", event);
        },
        onerror: (event) => {
          console.log("err", event);
        },
        onmessage: (event) => {
          const msg = JSON.parse((event as unknown as {data: string}).data)
          if(["SentenceBegin", "SentenceEnd", "TranscriptionResultChanged"].includes(msg.header.name)){
            setSentence(pre => {
              const copy = [...pre]
              copy[msg.payload.index] = msg.payload.result ?? ""
              return copy
            })
          }
        },
        onopen: () => {
          console.log("open");
        } 
      }
      
      )
      setWs(wsConnect);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const quality: Audio.RecordingOptions = JSON.parse(JSON.stringify(Audio.RecordingOptionsPresets.LOW_QUALITY))
      quality.android.sampleRate = 16000
      quality.ios.sampleRate = 16000
      quality.ios.extension = ".pcm"
      quality.ios.numberOfChannels = 1
      
      const { recording } = await Audio.Recording.createAsync(
        quality,
        async (status) => {
          if (status.durationMillis > 500) {
            const uri = recording.getURI();
            if (uri != null) {
              const fileStatus = await FileSystem.getInfoAsync(uri, {});
              if (fileStatus.exists) {
                setRecordStart((prePosition) => {
                  if (fileStatus.size>0 && fileStatus.size != prePosition && wsConnect?.readyState == wsConnect?.OPEN) {
                    const length = fileStatus.size - prePosition;
                    (async () => {
                      const data = await FileSystem.readAsStringAsync(uri, {
                        encoding: "base64",
                        position: prePosition,
                        length,
                      });
                      wsConnect?.send(Buffer.from(data, "base64"))
                    })();
                    return fileStatus.size;
                  }
                  return prePosition;
                });
              }
            }
          }
          setVolume(status.metering ?? -160);
        },
        500
      );
      setRecoding(recording);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSpeechEnd = async () => {
    ws?.close()
    setRecoding(undefined);
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    setTextInputDisable(false);
    setTimeout(() => {
      textInputRef?.current?.focus();
      setUseSpeech(false);
    }, 0);
  };

  React.useEffect(() => {
    return () =>{
      if(ws){
        ws.onclose = null
        ws.onerror = null
        ws.onmessage = null
        ws.onopen = null
        ws.close()
      }
    }
  }, [ws])

  React.useEffect(() => {
    return () => {
      if (recording) {
        recording?.setOnRecordingStatusUpdate(null);
        recording.getStatusAsync().then((status) => {
          if (status.isRecording) {
            recording.stopAndUnloadAsync();
          }
        });
        Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
      }
    };
  }, [recording]);

  React.useEffect(() => {
    if (loadingMessage.length != 0) {
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd(); // 需要在布局完成后调用
      }, 0);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [loadingMessage.length == 0]);

  const handleSendMessage = async (message: string) => {
    dispatch({
      type: "add",
      chatContent: {
        role: "user",
        content: message,
      },
    });
    setEs(
      new EventSource("http://10.249.41.229:3010/chat/getChatGptResponse", {
        headers: {
          "Content-Type": "application/json",
          Authorization: (await storage.get("jwt-token")) as string,
        },
        method: "POST",
        body: JSON.stringify({
          chatId: props.chatId,
          message,
        }),
      })
    );
  };

  sseHook(es, setLoadingMessage, setIsLoadingMessage, dispatch, scrollViewRef);
  initChatListHook(dispatch, scrollViewRef, props.chatId);

  return (
    <chatContext.Provider
      value={{
        chatId: props.chatId,
        chatContentList,
        dispatch,
        scrollViewRef,
        loadingMessage,
        handleSendMessage,
        isLoadingMessage,
        es,
        handleSpeechStart,
        useSpeech,
        keyboardHeight,
        setTextValue,
        textValue,
        textInputRef,
        handleSpeechEnd,
        textInputDisable,
        setTextInputDisable,
        volume,
      }}
    >
      {props.children}
    </chatContext.Provider>
  );
};
