import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SharedValue, withTiming } from "react-native-reanimated";
import { SEARCH_BAR_PADDING_HORIZONTAL } from "../../../animation/useAnimatedHeaderStyles";

interface HomeHeaderActionsProps {
  tagsHeight: SharedValue<number>;
  translateSearch: SharedValue<number>;
}

const HomeHeaderActions = ({
  tagsHeight,
  translateSearch,
}: HomeHeaderActionsProps) => {
  return (
    <View
      className="flex-row justify-between w-full"
      style={{ paddingHorizontal: SEARCH_BAR_PADDING_HORIZONTAL }}
    >
      <Text className="text-white">Add</Text>
      <Text className="text-white">NextSync</Text>
      <TouchableOpacity
        onPress={() => {
          tagsHeight.value = withTiming(40);
          translateSearch.value = withTiming(SEARCH_BAR_PADDING_HORIZONTAL);
        }}
      >
        <Text className="text-white">Search</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeaderActions;