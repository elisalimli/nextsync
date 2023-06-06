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
import { useSearchStore } from "../../../stores/searchStore";
import { useFragment } from "../../../gql";
import { Tag_Fragment } from "../../../graphql/query/post/posts";

interface SearchBarProps {
  translateSearch: SharedValue<number>;
  tagsHeight: SharedValue<number>;
}

const SearchBar = ({ translateSearch, tagsHeight }: SearchBarProps) => {
  const { data } = useQuery(tagsQueryDocument);
  const tags = useFragment(Tag_Fragment, data?.tags) || [];
  const { activeTagIds } = useSearchStore();

  // Filter active tags
  const activeTagItems =
    tags.filter((tag) => activeTagIds.includes(tag?.id)) || [];

  // Filter inactive tags
  const inactiveTagItems =
    tags.filter((tag) => !activeTagIds.includes(tag?.id)) || [];

  const searchBarAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateSearch.value }],
    };
  });

  const scrollViewRef = React.useRef<ScrollView>(null);

  const scrollToStart = () => {
    if (scrollViewRef.current)
      scrollViewRef.current.scrollTo({ x: 0, animated: true });
  };

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
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {activeTagItems.map((tag: any) => (
            <SearchTag
              scrollToStart={scrollToStart}
              active
              key={`search-tag-${tag?.id}`}
              tag={tag}
            />
          ))}
          {inactiveTagItems.map((tag: any) => (
            <SearchTag
              scrollToStart={scrollToStart}
              key={`search-tag-${tag?.id}`}
              tag={tag}
            />
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default SearchBar;
