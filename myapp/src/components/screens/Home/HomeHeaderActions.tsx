import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SharedValue, withTiming } from "react-native-reanimated";
import {
  SEARCH_BAR_PADDING_HORIZONTAL,
  TAGS_HEIGHT_EXPANDED,
} from "../../../animation/useAnimatedHeaderStyles";
import { useRouter } from "expo-router";

interface HomeHeaderActionsProps {
  tagsHeight: SharedValue<number>;
  translateSearch: SharedValue<number>;
}

const HomeHeaderActions = ({
  tagsHeight,
  translateSearch,
}: HomeHeaderActionsProps) => {
  const router = useRouter();
  const handleAddPress = () => {
    router.push("/post/create-post-0");
  };
  return (
    <View
      className="flex-row justify-between w-full"
      style={{ paddingHorizontal: SEARCH_BAR_PADDING_HORIZONTAL }}
    >
      <TouchableOpacity onPress={handleAddPress}>
        <Text className="text-white">Add</Text>
      </TouchableOpacity>
      <Text className="text-white">NextSync</Text>
      <TouchableOpacity
        onPress={() => {
          tagsHeight.value = withTiming(TAGS_HEIGHT_EXPANDED);
          translateSearch.value = withTiming(SEARCH_BAR_PADDING_HORIZONTAL);
        }}
      >
        <Text className="text-white">Search</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeaderActions;
