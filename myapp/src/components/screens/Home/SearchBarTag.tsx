import React from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FragmentType, useFragment } from "../../../gql";
import {
  Catalog_Fragment,
  Tag_Fragment,
} from "../../../graphql/query/post/posts";
import { useSearchStore } from "../../../stores/searchStore";
import clsx from "clsx";

type SearchTagProps = {
  tag: FragmentType<typeof Tag_Fragment>;
  active?: boolean;
  scrollToStart: () => void;
};

const SearchTag: React.FC<SearchTagProps> = ({
  active,
  tag,
  scrollToStart,
}) => {
  const data = useFragment(Tag_Fragment, tag);
  const catalog = useFragment(Catalog_Fragment, data?.catalog);
  const { addTag, removeTag } = useSearchStore();

  const handlePress = () => {
    const tagId = data?.id;
    if (active) removeTag(tagId);
    else addTag(tagId);

    if (!active) scrollToStart();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePress}
        className={clsx(
          "bg-white mr-2 px-3 py-1.5 rounded-full",
          active && "bg-secondary"
        )}
      >
        <Text
          className={clsx(
            "text-[#171717] text-xs font-light",
            active && "text-white"
          )}
        >
          {catalog?.name && `${catalog?.name} : `} {data?.name}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchTag;

const styles = StyleSheet.create({
  container: {},
});
