import { useQuery } from "@apollo/client";
import React from "react";
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFragment } from "../../../gql";
import { User_Fragment, meQueryDocument } from "../../../graphql/query/user/me";

import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { TouchableOpacity } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;
export const HEADER_HEIGHT_EXPANDED = verticalScale(200);
const HEADER_HEIGHT_NARROWED = verticalScale(85);
const SEARCH_BAR_PADDING_HORIZONTAL = 16;
interface HomeHeaderProps {
  scrollY: SharedValue<number>;
  scrollDiffY: SharedValue<number>;
}

const HomeHeader = ({ scrollY, scrollDiffY }: HomeHeaderProps) => {
  const router = useRouter();
  const { control } = useForm();
  const { data } = useQuery(meQueryDocument, {
    nextFetchPolicy: "cache-only", // Used for subsequent executions
  });
  const insets = useSafeAreaInsets();

  const user = useFragment(User_Fragment, data?.me);
  console.log(insets.top);

  const handleAddPress = () => {
    router.push("/post/createPost");
  };

  const translateSearch = useSharedValue(width);

  const searchBarAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateSearch.value }],
    };
  });

  const animatedStyles = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 100],
      [HEADER_HEIGHT_EXPANDED, HEADER_HEIGHT_NARROWED],
      {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      }
    );

    const headerY = interpolate(
      scrollDiffY.value,
      [0, HEADER_HEIGHT_NARROWED],
      [0, -HEADER_HEIGHT_EXPANDED],
      {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      }
    );

    return {
      height,
      transform: [{ translateY: headerY }],
    };
  });

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
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          zIndex: 100,
          backgroundColor: "orange",
          paddingTop: insets.top,
          paddingBottom: 12,
          alignItems: "center",
          justifyContent: "flex-end",
        },
        animatedStyles,
      ]}
    >
      <Animated.Text
        style={animatedTextStyles}
        className="text-2xl font-bold text-white py-8"
      >
        Hello {user?.username}
      </Animated.Text>

      <View
        className="flex-row justify-between w-full"
        style={{ paddingHorizontal: SEARCH_BAR_PADDING_HORIZONTAL }}
      >
        <Text>Add</Text>
        <Text>NextSync</Text>
        <TouchableOpacity
          onPress={() => {
            translateSearch.value = withSpring(SEARCH_BAR_PADDING_HORIZONTAL);
          }}
        >
          <Text>Search</Text>
        </TouchableOpacity>
        <Animated.View
          className="w-full bg-red-500 absolute flex-row"
          style={searchBarAnimatedStyles}
        >
          <TextInput
            placeholder="type something.."
            className="bg-blue-500 flex-1"
          ></TextInput>
          <TouchableOpacity
            onPress={() => {
              translateSearch.value = withSpring(width);
            }}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {},
});
