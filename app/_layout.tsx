import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { AuthProvider } from "../context/auth";
import { AuthAxiosProvider } from "../context/authAxiosProvider";
import { Provider as PaperProvider } from "react-native-paper";
import { LoadingProvider } from "../context/loadingProvider";
import { RootSiblingParent } from "react-native-root-siblings";
import { AuthWebSocketProvider } from "../context/authWebsocket";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <>
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {!loaded && <SplashScreen />}
      {loaded && <RootLayoutNav />}
    </>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <PaperProvider
            settings={{
              rippleEffectEnabled: false,
            }}
          >
            <LoadingProvider>
              <RootSiblingParent>
                <AuthAxiosProvider>
                  <AuthWebSocketProvider>
                    <Stack>
                      <Stack.Screen
                        name="index"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="(auth)"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="chat"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="meTab"
                        options={{ headerShown: false }}
                      />
                    </Stack>
                  </AuthWebSocketProvider>
                </AuthAxiosProvider>
              </RootSiblingParent>
            </LoadingProvider>
          </PaperProvider>
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}
