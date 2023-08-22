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
import SearchInput from "./SearchInput";
import { useQuery } from "@tanstack/react-query";
import { graphqlRequestClient } from "../../../graphql/requestClient";
import { MaterialIcons } from "@expo/vector-icons";

interface SearchBarProps {
  translateSearch: SharedValue<number>;
  tagsHeight: SharedValue<number>;
}

const SearchBar = ({ translateSearch, tagsHeight }: SearchBarProps) => {
  const { data } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => graphqlRequestClient.request(tagsQueryDocument),
    // networkMode: "offlineFirst",
  });
  const tags = useFragment(Tag_Fragment, data?.tags) || [];
  const { activeTagIds } = useSearchStore();

  // Filter active tags
  const activeTagItems =
    tags.filter((tag) => (activeTagIds || []).includes(tag?.id)) || [];

  // Filter inactive tags
  const inactiveTagItems =
    tags.filter((tag) => !(activeTagIds || []).includes(tag?.id)) || [];

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
        <View className="flex-row justify-center items-center flex-1 w-full my-4">
          {/* Search Input */}
          <View className="flex-[9]">
            <SearchInput />
          </View>

          {/* Cancel Button */}
          <View className="flex-[1] ml-1">
            <TouchableOpacity
              onPress={() => {
                tagsHeight.value = withTiming(0);
                translateSearch.value = withTiming(constants.SCREEN_WIDTH);
              }}
            >
              <MaterialIcons name="cancel" size={24} color="white" />
            </TouchableOpacity>
          </View>
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
