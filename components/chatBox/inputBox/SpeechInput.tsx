import {
  View,
  StyleSheet,
  Keyboard,
  AppState,
  AppStateStatus,
  Text,
  Pressable,
} from "react-native";
import { pTx, scalefontSize } from "../../../utils/style";
import { useChatContext } from "../../../context/chatRoomProvider";
import React, { useRef, useEffect } from "react";
import LottieView from "lottie-react-native";
import { seconds2Min } from "../../../utils/utils";
import { Feather } from "@expo/vector-icons";

const SpeechInput = () => {
  const chatContext = useChatContext();
  const keyboardHeight =
    chatContext?.keyboardHeight == 0 ? pTx(200) : chatContext?.keyboardHeight;
  const lottieRef = useRef<LottieView | null>(null);
  const [timer, setTimer] = React.useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setTimer((pre) => pre + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {

  }, [chatContext?.volume])

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        lottieRef.current?.play();
      }
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);
  return (
    <Pressable onPress={chatContext?.handleSpeechEnd}>
      <View
        style={[
          style.container,
          {
            height: keyboardHeight,
          },
        ]}
      >
        <Text style={style.timer}>{seconds2Min(timer)}</Text>
        <LottieView
          ref={lottieRef}
          autoPlay
          loop
          source={require("../../../assets/lottiefiles/animation_ljzq42ot.json")}
          style={{
            width: (keyboardHeight ?? pTx(200))*(((chatContext?.volume?? -160)+160)/160)**2,
            height: (keyboardHeight ?? pTx(200))*(((chatContext?.volume?? -160)+160)/160)**2,
            backgroundColor: "transparent",
          }}
        />
        <Text style={style.stopSign}>
          <Feather name="stop-circle" size={scalefontSize(1.5)} color="grey" />{" "}
          点击停止录音
        </Text>
      </View>
    </Pressable>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: "#A9BABF20",
    justifyContent: "center",
    alignItems: "center",
  },
  timer: {
    position: "absolute",
    left: pTx(10),
    top: pTx(10),
    fontSize: scalefontSize(1.2),
    color: "grey",
  },
  stopSign: {
    position: "absolute",
    fontSize: scalefontSize(1.5),
    color: "grey",
  },
});

export default SpeechInput;
