import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { ViewProps } from "./Themed";
import clsx from "clsx";

interface SeperatorProps extends ViewProps {
  isAnimated: boolean;
}

const Seperator = ({ isAnimated, ...props }: SeperatorProps) => {
  let C = View;
  if (isAnimated) C = Animated.View as any;

  return (
    <C
      {...props}
      className={clsx("w-full h-[1px] bg-gray/20", props?.className)}
    />
  );
};

export default Seperator;

const styles = StyleSheet.create({
  container: {},
});
