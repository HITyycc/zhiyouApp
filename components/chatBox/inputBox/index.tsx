import { View, StyleSheet, ScrollView, Keyboard } from "react-native";
import UserInput from "./userInput";
import { pTx } from "../../../utils/style";
import React from "react";
import { useChatContext } from "../../../context/chatRoomProvider";

const InputBox = () => {
    const [KeyboardShow, setKeyboardShow] = React.useState(false);
    const chatContext = useChatContext()
    
    React.useEffect(() => {
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
      }, []);

    return <View style={[style.container, KeyboardShow || chatContext?.useSpeech ? style.containerKeyboardShow : {}]}>
        <UserInput />
    </View>
}

const style = StyleSheet.create({
    container: {
      paddingBottom: pTx(20),
      backgroundColor: "white",
    },
    containerKeyboardShow: {
      paddingBottom: pTx(10),
    },
  });

export default InputBox