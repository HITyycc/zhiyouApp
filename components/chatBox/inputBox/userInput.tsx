import {
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  TextInput as RNInput,
  Pressable,
} from "react-native";
import { IconButton, MD2Colors, TextInput } from "react-native-paper";
import { useChatContext } from "../../../context/chatRoomProvider";
import { pTx, scalefontSize } from "../../../utils/style";
import { useEffect } from "react";
import React from "react";
import { LoadingDots } from "../../custome/LoadingDots";

const UserInput = () => {
  const chatContext = useChatContext();
  const [KeyboardShow, setKeyboardShow] = React.useState(false);
  const textInputRef = React.useRef<RNInput | null>(null);
  const [textValue, setTextValue] = React.useState("");
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardWillShow", () =>
      setKeyboardShow(true)
    );
    const hideSubscription = Keyboard.addListener("keyboardWillHide", () =>
      setKeyboardShow(false)
    );
    return () => {
      hideSubscription.remove();
      showSubscription.remove();
    };
  });

  return (
    <View
      style={[style.container, KeyboardShow ? style.containerKeyboardShow : {}]}
    >
      <TextInput
        multiline
        dense
        value={textValue}
        onChangeText={(data) => setTextValue(data)}
        ref={textInputRef}
        style={{
          width: pTx(200),
          backgroundColor: textInputRef?.current?.isFocused()
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
          ) : textValue.length == 0 ? (
            <TextInput.Icon icon={"contactless-payment"} />
          ) : null
        }
      />
      <IconButton
        size={pTx(14)}
        disabled={textValue.length == 0 || chatContext?.isLoadingMessage}
        onPress={() => {
          setTextValue("");
          chatContext?.handleSendMessage(textValue);
        }}
        icon="arrow-up"
        mode="contained"
        containerColor={
          textValue.length == 0 ? MD2Colors.blue100 : MD2Colors.blue600
        }
        iconColor="white"
      />
    </View>
  );
};

// 246=20+
const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: pTx(20),
    paddingHorizontal: pTx(10),
    backgroundColor: "white",
  },
  containerKeyboardShow: {
    paddingBottom: pTx(10),
  },
});

export default UserInput;
