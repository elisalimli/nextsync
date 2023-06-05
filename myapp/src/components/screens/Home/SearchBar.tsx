import { useQuery } from "@apollo/client";
import * as React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { constants } from "../../../constants";
import { tagsQueryDocument } from "../../../graphql/query/tag/tags";
import SearchTag from "./SearchBarTag";

interface SearchBarProps {
  translateSearch: SharedValue<number>;
  tagsHeight: SharedValue<number>;
}

const SearchBar = ({ translateSearch, tagsHeight }: SearchBarProps) => {
  const { data } = useQuery(tagsQueryDocument);

  const searchBarAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateSearch.value }],
    };
  });

  return (
    <Animated.View
      className="w-full absolute flex-row bg-primary z-40"
      style={searchBarAnimatedStyles}
    >
      <View className="my-4">
        <View className="flex-row flex-1 my-4">
          {/* Search Input */}
          <TextInput
            placeholder="type something.."
            className="bg-white flex-1"
          />

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={() => {
              tagsHeight.value = withTiming(0);
              translateSearch.value = withTiming(constants.SCREEN_WIDTH);
            }}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
        {/* Filter Tags */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {data?.tags.map((tag: any) => (
            <SearchTag key={`search-tag-${tag?.id}`} {...tag} />
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default SearchBar;
