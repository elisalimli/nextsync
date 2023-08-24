import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import { AuthProvider } from "../context/auth";

export { ErrorBoundary } from "expo-router";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import RNFS from "react-native-fs";
import { ModalContext } from "../src/components/contexts/ModalContext";
import { constants } from "../src/constants";
import { asyncStoragePersister, queryClient } from "../src/graphql/client";
import { ThemeProvider } from "@react-navigation/native";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

LogBox.ignoreLogs(["Unauthorized: Token has expired"]); // Ignore expired auth token

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    // const folderPath = `${RNFS.ExternalStorageDirectoryPath}/Download/nextsync`;
    const folderPath = constants.folderPath as string;
    console.log(RNFS.CachesDirectoryPath);
    RNFS.mkdir(folderPath)
      .then(() => {
        console.log("Folder created successfully.", folderPath);
      })
      .catch((error) => {
        console.log("Error creating folder:", error);
      });
  }, []);

  return (
    <>
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {!loaded && <SplashScreen />}
      {loaded && <RootLayoutNav />}
    </>
  );
}

function RootLayoutNav() {
  const [modalVisible, setModalVisible] = React.useState({});

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => !!query.state.data,
        },
      }}
    >
      <StatusBar style="dark" />
      {/* <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}> */}
      <AuthProvider>
        <ModalContext.Provider value={{ modalVisible, setModalVisible }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </Stack>
        </ModalContext.Provider>
      </AuthProvider>
      <AuthProvider>
        <ModalContext.Provider value={{ modalVisible, setModalVisible }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </Stack>
        </ModalContext.Provider>
      </AuthProvider>
      {/* </ThemeProvider> */}
    </PersistQueryClientProvider>
  );
}
