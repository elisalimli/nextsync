import { useQuery } from "@apollo/client";
import React from "react";
import { Text, View } from "react-native";
import { postsQueryDocument } from "../../../graphql/query/post/posts";
import Post from "./Post";
import { Post_FragmentFragment } from "../../../gql/graphql";

function Posts() {
  const { data, loading, error } = useQuery(postsQueryDocument);
  if (error) {
    return <Text>Something went wrong while retrieving posts</Text>;
  }
  if (loading) {
    return <Text>Loading...</Text>;
  }
  return (
    <View>
      <Text className="text-2xl font-bold">Recent Posts</Text>
      {data?.posts &&
        data.posts.map((post: any) => (
          <Post key={`posts-list-${post?.id}`} {...post} />
        ))}
    </View>
  );
}

export default Posts;
