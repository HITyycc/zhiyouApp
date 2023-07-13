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

import { Audio } from "expo-av";
import { showToast } from "../../utils/utils";

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
  // -160~0
  const [volume, setVolume] = React.useState(-160)

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
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status) => {
          setVolume(status.metering ?? -160)
          console.log(status);
        },
        500
      );
      setRecoding(recording);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSpeechEnd = async() => {
    setRecoding(undefined);
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    setTextInputDisable(false);
    setTimeout(() => {
      textInputRef?.current?.focus();
      setUseSpeech(false);
    }, 0);
  };

  React.useEffect(() => {
    return () => {
      if(recording){
        recording?.setOnRecordingStatusUpdate(null)
        recording.getStatusAsync().then(status => {
          if(status.isRecording){
            recording.stopAndUnloadAsync()
          }
        })
        Audio.setAudioModeAsync(
          {
            allowsRecordingIOS: false,
          }
        );
      }
    }
  }, [recording])

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
        volume
      }}
    >
      {props.children}
    </chatContext.Provider>
  );
};
