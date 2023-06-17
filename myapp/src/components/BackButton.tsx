import { useRouter } from "expo-router";
import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  GestureResponderEvent,
} from "react-native";

interface BackButtonProps {
  children: React.ReactNode;
  containerProps?: TouchableOpacityProps;
}

const BackButton = (props: BackButtonProps) => {
  const router = useRouter();

  const handlePress = (e: GestureResponderEvent) => {
    if (props?.containerProps?.onPress) props.containerProps.onPress(e);
    router.back();
  };

  return (
    <TouchableOpacity
      {...props.containerProps}
      className={props?.containerProps?.className}
      onPress={handlePress}
    >
      {props.children}
    </TouchableOpacity>
  );
};

export default BackButton;
