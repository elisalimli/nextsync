import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import { AuthProvider } from "../context/auth";

export { ErrorBoundary } from "expo-router";

import { ApolloProvider } from "@apollo/client";
import { client } from "../src/graphql/client";

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
  const router = useRouter();
  return (
    <>
      <ApolloProvider client={client}>
        {/* <ThemeProvider */}
        {/* value={colorScheme === "dark" ? DarkTheme : DefaultTheme} */}
        {/* > */}
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </Stack>
        </AuthProvider>
        {/* </ThemeProvider> */}
      </ApolloProvider>
    </>
  );
}
