import { useQuery } from "@apollo/client";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { useFragment } from "../../../gql";
import {
  Post_Fragment,
  postsQueryDocument,
} from "../../../graphql/query/post/posts";
import Post from "./Post";

function Posts() {
  const { data, loading, error, fetchMore } = useQuery(postsQueryDocument, {
    variables: { input: { limit: 5 } },
  });
  if (error) {
    return <Text>Something went wrong while retrieving posts</Text>;
  }
  if (loading) {
    return <Text>Loading...</Text>;
  }
  return (
    <View className="flex-1">
      {data?.posts && (
        <FlatList
          onEndReached={() => {
            const posts = useFragment(Post_Fragment, data?.posts);
            fetchMore({
              variables: {
                input: {
                  cursor: posts[posts?.length - 1].createdAt,
                  limit: 5,
                },
              },
            });
          }}
          style={{ flexGrow: 1 }}
          data={data?.posts}
          renderItem={({ item }) => <Post {...item} />}
          keyExtractor={(item: any) => item?.id}
        />
      )}
    </View>
  );
}

export default Posts;
