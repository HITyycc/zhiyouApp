import { useLocalSearchParams } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Keyboard
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChatContextProvider,
  useChatContext,
} from "../../context/chatRoomProvider";
import ChatShower from "../../components/chatBox/chatShower";
import InputBox from "../../components/chatBox/inputBox";
import { TextInput } from "react-native-paper";
import { useHeaderHeight } from "@react-navigation/elements";
import { fillStyle } from "../../utils/style";

const Conversation = () => {
  const height = useHeaderHeight();
  Keyboard.isVisible
  return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={height}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={style.container}
        enabled
      >
        <ChatShower />
        <InputBox />
        
      </KeyboardAvoidingView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1
  },
});

export default () => {
  const { id } = useLocalSearchParams();
  return (
    <ChatContextProvider chatId={id as string}>
      <Conversation />
    </ChatContextProvider>
  );
};
