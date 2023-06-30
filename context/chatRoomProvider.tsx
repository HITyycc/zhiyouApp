import React, { useReducer } from "react";
import { useAuthAxios } from "./authAxiosProvider";
import { TextInput as RNTextInput, ScrollView } from "react-native";
import { storage } from "../utils/store";
import { useAuth } from "./auth";
import EventSource, {
  EventSourceListener,
  ErrorEvent as sseErrorEvent,
  MessageEvent as sseMessageEvent
} from "react-native-sse";
import { showToast } from "../utils/utils";

interface chatContent {
  role: string;
  content: string;
}

interface actionType {
  type: "set" | "add";
  chatContent?: chatContent;
  chatContentList?: Array<chatContent>;
  scrollViewRef?: React.RefObject<ScrollView>;
}

const chatContentListReducer = (
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

interface chatProviderValues {
  chatId: string;
  chatContentList: Array<chatContent>;
  dispatch: React.Dispatch<actionType>;
  scrollViewRef: React.RefObject<ScrollView>;
  loadingMessage: string;
  isLoadingMessage: boolean;
  handleSendMessage: (message: string) => void;
}

const chatContext = React.createContext<null | chatProviderValues>(null);

export const useChatContext = () => {
  return React.useContext(chatContext);
};

const sayHi = {
  role: "assistant",
  content: "你好呀！有什么需要帮助你的？",
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
  const auth = useAuth();
  const [es, setEs] = React.useState<EventSource|null>(null)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd() // 需要在布局完成后调用
    }, 0)
    return () => {
      clearTimeout(timer)
    }
  }, [chatContentList, scrollViewRef.current])

  React.useEffect(() => {
    if(loadingMessage.length != 0){
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd() // 需要在布局完成后调用
      }, 0)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [loadingMessage.length == 0])

  const handleSendMessage = async (message: string) => {
    dispatch({
      type: "add",
      chatContent: {
        role: "user",
        content: message,
      },
    });
    setEs(new EventSource(
        "http://10.249.41.229:3010/chat/getChatGptResponse",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: (await storage.get("jwt-token")) as string,
          },
          method: "POST",
          body: JSON.stringify({
            chatId: props.chatId,
            message,
          }),
        }
      )) 
  };

  React.useEffect(() => {
    if(es){
        const handleOpen: EventSourceListener = (event) => {
          };
      
          const handleMessage: EventSourceListener = (event) => {
              const data = (event as sseMessageEvent).data
                if((data as string).includes("[DONE]")){
                    es.close()
                }else{
                    console.log(data)
                    setLoadingMessage(pre => pre+data?.slice(1))
                }
              
          };
      
          const handleError: EventSourceListener = (event) => {
            es.close()
            if ((event as sseErrorEvent).xhrStatus == 401) {
              showToast("用户未登录", "fail")
              auth?.signOut()
            }
          };
      
          const handleClose: EventSourceListener = (event) => {
            setIsLoadingMessage(false)
            setLoadingMessage(pre => {
                dispatch({
                    type: "add",
                    chatContent: {
                        role: "assistant",
                        content: pre
                    }
                })
                return ""
            })
          };
          es.addEventListener("open", handleOpen);
          es.addEventListener("message", handleMessage);
          es.addEventListener("error", handleError);
          es.addEventListener("close", handleClose);
    }
    return () => {
        setIsLoadingMessage(true)
        setLoadingMessage(pre => {
            dispatch({
                type: "add",
                chatContent: {
                    role: "assistant",
                    content: pre
                }
            })
            return ""
        })
        if(es){
            es.removeAllEventListeners()
            es.close()
        }
    }
  }, [es])

  React.useEffect(() => {
    (async () => {
      const res = await authAxios?.authAxios.get(
        `http://10.249.41.229:3010/chat/getChatContentList?chatId=${props.chatId}`
      );
      if (res?.data.data.chatContentList instanceof Array) {
        dispatch({
          type: "set",
          chatContentList: [sayHi, ...res?.data.data.chatContentList],
          scrollViewRef,
        });
      }
    })();
  }, [props.chatId]);

  return (
    <chatContext.Provider
      value={{
        chatId: props.chatId,
        chatContentList,
        dispatch,
        scrollViewRef,
        loadingMessage,
        handleSendMessage,
        isLoadingMessage
      }}
    >
      {props.children}
    </chatContext.Provider>
  );
};
