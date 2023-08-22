import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { Post_FragmentFragment } from "../../src/gql/graphql";
import { useQuery } from "@tanstack/react-query";
import { graphqlRequestClient } from "../../src/graphql/requestClient";
import { postQueryDocument } from "../../src/graphql/query/post/post";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFragment } from "../../src/gql";
import { Post_Fragment } from "../../src/graphql/query/post/posts";
import PostDescription from "../../src/components/screens/Home/PostDescription";
import { ScrollView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

interface PostProps {}

const Post = (props: PostProps) => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { id } = params;

  const { data, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () =>
      graphqlRequestClient.request(postQueryDocument, {
        input: { id: id as string },
      }),
  });

  if (isLoading) {
    return <ActivityIndicator size={"large"} />;
  }

  if (data?.post) {
    const post = useFragment(Post_Fragment, data.post);

    return (
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <Stack.Screen options={{ title: "Read More...", headerShown: true }} />
        <StatusBar style="dark" />
        <ScrollView className="p-2">
          <Text className="text-2xl"> {post?.title}</Text>
          <PostDescription post={post} />
        </ScrollView>
      </SafeAreaView>
    );
  }
};

export default Post;
