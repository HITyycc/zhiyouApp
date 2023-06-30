import { View, StyleSheet, ScrollView } from "react-native";
import { useChatContext } from "../../../context/chatRoomProvider";
import ContentBox from "./contentBox";
import { pTx } from "../../../utils/style";
import { TextInput } from "react-native-paper";
import React from "react";

const ChatShower = () => {
  const chatContext = useChatContext();
  const [scrollHeight, setScrollHeight] = React.useState(0);

  return (
    <ScrollView
      onLayout={(event) => {
        const height = event.nativeEvent.layout.height
        setScrollHeight(pre => {
            if(pre > height){
                chatContext?.scrollViewRef.current?.scrollToEnd();
            }
            return height
        });
        
      }}
      ref={chatContext?.scrollViewRef}
      style={style.container}
      contentContainerStyle={{
        rowGap: pTx(10),
        flexGrow: 1,
        paddingVertical: pTx(8),
      }}
    >
      {chatContext?.chatContentList.map((val, idx) => (
        <ContentBox
          key={idx}
          content={val.content}
          left={val.role == "assistant"}
        />
      ))}
      {
        chatContext?.loadingMessage && <ContentBox
        content={chatContext?.loadingMessage}
        left
        showLoadingDot
      />
      }
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: pTx(8),
  },
});

export default ChatShower;
