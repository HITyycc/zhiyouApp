import React from "react";
import { useAuthAxios } from "./../authAxiosProvider";
import { Keyboard, TextInput as RNTextInput, ScrollView, TextInput as RNInput } from "react-native";
import { storage } from "../../utils/store";
import { useAuth } from "./../auth";
import EventSource, {
  EventSourceListener,
  ErrorEvent as sseErrorEvent,
  MessageEvent as sseMessageEvent,
} from "react-native-sse";
import { showToast } from "../../utils/utils";
import { AxiosInstance } from "axios";

export interface chatContent {
    role: string;
    content: string;
  }

export interface actionType {
    type: "set" | "add";
    chatContent?: chatContent;
    chatContentList?: Array<chatContent>;
    scrollViewRef?: React.RefObject<ScrollView>;
  }
  
export const chatContentListReducer = (
    chatContentList: Array<chatContent>,
    action: actionType
  ) => {
    switch (action.type) {
      case "add": {
        if (action.chatContent?.role && action.chatContent?.content) {
          return [
            ...chatContentList,
            {
              role: action.chatContent?.role,
              content: action.chatContent?.content,
            },
          ];
        } else {
          return [...chatContentList];
        }
      }
      case "set": {
        return [...(action.chatContentList ?? [])];
      }
    }
  };

  const sayHi = {
    role: "assistant",
    content: "你好呀！有什么需要帮助你的？",
  };

  // 聊天记录初始化
export const initChatListHook = (dispatch: React.Dispatch<actionType>,  scrollViewRef: React.RefObject<ScrollView>, chatId: string) =>{
    const authAxios = useAuthAxios();
    React.useEffect(() => {
        (async () => {
          const res = await authAxios?.authAxios.get(
            `http://10.249.41.229:3010/chat/getChatContentList?chatId=${chatId}`
          );
          if (res?.data.data.chatContentList instanceof Array) {
            dispatch({
              type: "set",
              chatContentList: [sayHi, ...res?.data.data.chatContentList],
              scrollViewRef,
            });
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd(); // 需要在布局完成后调用
            }, 0);
          }
        })();
      }, [chatId]);
}

export const sseHook = (es:EventSource | null, setLoadingMessage: React.Dispatch<React.SetStateAction<string>>, setIsLoadingMessage: React.Dispatch<React.SetStateAction<boolean>>, dispatch: React.Dispatch<actionType>, scrollViewRef: React.RefObject<ScrollView>) => {
    const auth = useAuth();
    React.useEffect(() => {
        if (es) {
          const handleOpen: EventSourceListener = (event) => {};
    
          const handleMessage: EventSourceListener = (event) => {
            const data = (event as sseMessageEvent).data;
            if ((data as string).includes("[DONE]")) {
              es.close();
            } else {
              setLoadingMessage((pre) => pre + data?.slice(1));
            }
          };
    
          const handleError: EventSourceListener = (event) => {
            es.close();
            if ((event as sseErrorEvent).xhrStatus == 401) {
              showToast("用户未登录", "fail");
              auth?.signOut();
            }
          };
    
          const handleClose: EventSourceListener = (event) => {
            setIsLoadingMessage(false);
            setLoadingMessage((pre) => {
              dispatch({
                type: "add",
                chatContent: {
                  role: "assistant",
                  content: pre,
                },
              });
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd(); // 需要在布局完成后调用
              }, 0);
              return "";
            });
          };
          es.addEventListener("open", handleOpen);
          es.addEventListener("message", handleMessage);
          es.addEventListener("error", handleError);
          es.addEventListener("close", handleClose);
        }
        return () => {
          setIsLoadingMessage(true);
          setLoadingMessage((pre) => {
            dispatch({
              type: "add",
              chatContent: {
                role: "assistant",
                content: pre,
              },
            });
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd(); // 需要在布局完成后调用
            }, 0);
            return "";
          });
          if (es) {
            es.removeAllEventListeners();
            es.close();
          }
        };
      }, [es]);
}

export const getKeyBoardHeightHook = (setKeyboardHeight: React.Dispatch<React.SetStateAction<number>>) => {
    React.useEffect(() => {
        const listener = Keyboard.addListener('keyboardDidShow', (event) => {
          setKeyboardHeight(event.endCoordinates.height)
          listener.remove()
        })
      }, [])
}