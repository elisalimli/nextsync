import * as React from "react";
import { Platform, SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CustomSafeAreaViewProps {
  children: React.ReactNode;
}

const CustomSafeAreaView = ({ children }: CustomSafeAreaViewProps) => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: Platform.OS == "android" ? insets.top + 12 : 0,
        marginBottom: 10,
      }}
    >
      {children}
    </SafeAreaView>
  );
};

export default CustomSafeAreaView;
