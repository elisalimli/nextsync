import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";

interface HeaderGreetingProps {
  username: string | undefined;
  scrollY: SharedValue<number>;
}

const HeaderGreeting = ({ username, scrollY }: HeaderGreetingProps) => {
  const animatedTextStyles = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [1, 0], {
      extrapolateLeft: Extrapolation.CLAMP,
      extrapolateRight: Extrapolation.CLAMP,
    });

    return {
      opacity,
    };
  });
  return (
    <Animated.Text
      style={animatedTextStyles}
      className="text-2xl font-bold text-white py-8"
    >
      Hello {username}
    </Animated.Text>
  );
};

export default HeaderGreeting;

const styles = StyleSheet.create({
  container: {},
});
