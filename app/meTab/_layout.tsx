import { Stack } from "expo-router";

 const ChatLayout = () => {
    return <Stack >
        <Stack.Screen name="userInfo" options={{
            title: "个人信息"
        }}/>
    </Stack>
}

export default ChatLayout