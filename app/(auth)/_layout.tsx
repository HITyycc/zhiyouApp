import { Stack } from "expo-router";


export default function AuthLayout() {
    return <Stack initialRouteName="welcome" >
        <Stack.Screen name="welcome" options={{ headerShown: false }}/>
        <Stack.Screen name="getSmsCode" options={{ headerShown: false }}/>
        <Stack.Screen name="inputSmsCode" options={{ headerShown: false }}/>
    </Stack>
}