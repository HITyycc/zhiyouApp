import { View, StyleSheet, Keyboard } from "react-native";
import { IconButton, MD2Colors, TextInput } from "react-native-paper";
import { useChatContext } from "../../../context/chatRoomProvider";
import { pTx, scalefontSize } from "../../../utils/style";
import { useEffect } from "react";
import React from "react";
import { LoadingDots } from "../../custome/LoadingDots";

const UserInput = () => {
  const chatContext = useChatContext();

  

  return (
    <View style={style.container}>
      <TextInput
        multiline
        dense
        disabled={chatContext?.textInputDisable}
        autoFocus
        value={chatContext?.textValue}
        onChangeText={chatContext?.setTextValue}
        ref={chatContext?.textInputRef}
        style={{
          width: pTx(200),
          backgroundColor: chatContext?.textInputRef?.current?.isFocused()
            ? "white"
            : "#efefef",
        }}
        mode="outlined"
        activeOutlineColor="#dddddd"
        outlineColor="transparent"
        outlineStyle={{
          borderRadius: 50,
        }}
        placeholder="Message"
        right={
          chatContext?.isLoadingMessage ? (
            <TextInput.Icon icon={LoadingDots} />
          ) : chatContext?.textValue.length != 0 || chatContext?.useSpeech ? null : (
            <TextInput.Icon icon={"contactless-payment"} onPress={chatContext?.handleSpeechStart}/>
          )
        }
      />
      {chatContext?.isLoadingMessage ? (
        <IconButton
          size={pTx(14)}
          onPress={() => {
            chatContext?.es?.close();
          }}
          mode="contained"
          icon="square-medium"
          iconColor="white"
          containerColor={MD2Colors.blue600}
        />
      ) : (
        <IconButton
          size={pTx(14)}
          disabled={chatContext?.textValue.length == 0 || chatContext?.isLoadingMessage}
          onPress={() => {
            chatContext?.setTextValue("");
            chatContext?.handleSendMessage(chatContext?.textValue);
          }}
          icon="arrow-up"
          mode="contained"
          containerColor={
            chatContext?.textValue.length == 0 ? MD2Colors.blue100 : MD2Colors.blue600
          }
          iconColor="white"
        />
      )}
    </View>
  );
};

// 246=20+
const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: pTx(10),
  },
});

export default UserInput;
