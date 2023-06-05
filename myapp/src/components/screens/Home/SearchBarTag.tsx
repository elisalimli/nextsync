import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import {
  Tag_Fragment,
  postsQueryDocument,
} from "../../../graphql/query/post/posts";
import { FragmentType, useFragment } from "../../../gql";
import { useSearchStore } from "../../../stores/search";
import { useQuery } from "@apollo/client";
import { constants } from "../../../constants";

type SearchTagProps = FragmentType<typeof Tag_Fragment>;

const SearchTag: React.FC<SearchTagProps> = (tag) => {
  const data = useFragment(Tag_Fragment, tag);
  const { tags, setTags } = useSearchStore();

  const { refetch } = useQuery(postsQueryDocument, {
    variables: { input: { limit: constants.POSTS_QUERY_LIMIT } },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={async () => {
          setTags(data?.id);
          await refetch({
            input: {
              limit: constants.POSTS_QUERY_LIMIT,
              tagIds: [...tags, data?.id],
            },
          });
        }}
        className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
      >
        <Text>{data?.name}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchTag;

const styles = StyleSheet.create({
  container: {},
});
