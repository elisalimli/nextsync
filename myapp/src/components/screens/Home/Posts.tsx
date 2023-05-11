import { useQuery } from "@apollo/client";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { postsQueryDocument } from "../../../graphql/query/post/posts";
import Post from "./Post";
import { Post_FragmentFragment } from "../../../gql/graphql";

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
  console.log(data?.posts);
  return (
    <View className="flex-1">
      <Text className="text-2xl font-bold">Recent Posts</Text>
      {data?.posts && (
        <FlatList
          onEndReached={() => {
            console.log(data?.posts[data?.posts?.length - 1].createdAt);
            fetchMore({
              variables: {
                input: {
                  cursor: data?.posts[data?.posts?.length - 1].createdAt,
                  limit: 5,
                },
              },
            });
          }}
          style={{ flexGrow: 1 }}
          data={data?.posts}
          renderItem={({ item }) => <Post {...item} />}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

export default Posts;
