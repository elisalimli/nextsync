import { useQuery } from "@apollo/client";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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
import { tagsQueryDocument } from "../../../graphql/query/tag/tags";
import { useSearchStore } from "../../../stores/search";
import SearchTag from "./SearchBarTag";

const { width, height } = Dimensions.get("screen");

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

export const HEADER_HEIGHT_EXPANDED = verticalScale(200);
const HEADER_HEIGHT_NARROWED = verticalScale(85);
const HEADER_HEIGHT_TAGS = verticalScale(85);
const SEARCH_BAR_PADDING_HORIZONTAL = 16;

interface HomeHeaderProps {
  scrollY: SharedValue<number>;
  scrollDiffY: SharedValue<number>;
}

const HomeHeader = ({ scrollY, scrollDiffY }: HomeHeaderProps) => {
  const { setTags } = useSearchStore();
  const router = useRouter();
  const { control } = useForm();
  const { data } = useQuery(meQueryDocument, {
    nextFetchPolicy: "cache-only", // Used for subsequent executions
  });

  const { data: tagsData } = useQuery(tagsQueryDocument);

  const insets = useSafeAreaInsets();

  const user = useFragment(User_Fragment, data?.me);

  const handleAddPress = () => {
    router.push("/post/createPost");
  };

  const translateSearch = useSharedValue(width);

  const searchBarAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateSearch.value }],
    };
  });

  const tagsHeight = useSharedValue(0);

  const animatedHeaderStyles = useAnimatedStyle(() => {
    const headerHeight = interpolate(
      scrollY.value,
      [0, 100],
      [
        HEADER_HEIGHT_EXPANDED + tagsHeight.value,
        HEADER_HEIGHT_NARROWED + tagsHeight.value,
      ],
      {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      }
    );
    const headerY = interpolate(
      scrollDiffY.value,
      [0, HEADER_HEIGHT_NARROWED + tagsHeight.value],
      [0, -(HEADER_HEIGHT_EXPANDED + tagsHeight.value)],
      {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      }
    );

    return {
      height: headerHeight,
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
          paddingTop: insets.top,
        },
        animatedHeaderStyles,
      ]}
      className="bg-primary items-center justify-end absolute top-0 left-0 right-0 pb-3 z-10"
    >
      <Animated.View
        className="w-full absolute flex-row bg-primary z-40"
        style={searchBarAnimatedStyles}
      >
        <View className="my-4">
          <View className="flex-row flex-1 my-4">
            <TextInput
              placeholder="type something.."
              className="bg-white flex-1"
            />
            <TouchableOpacity
              onPress={() => {
                tagsHeight.value = withSpring(0);
                translateSearch.value = withSpring(width);
              }}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tagsData?.tags.map((tag: any) => (
              <SearchTag key={`search-tag-${tag?.id}`} {...tag} />
            ))}
          </ScrollView>
        </View>
      </Animated.View>
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
        <Text className="text-white">Add</Text>
        <Text className="text-white">NextSync</Text>
        <TouchableOpacity
          onPress={() => {
            tagsHeight.value = withSpring(40);
            translateSearch.value = withSpring(SEARCH_BAR_PADDING_HORIZONTAL);
          }}
        >
          <Text className="text-white">Search</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {},
});
