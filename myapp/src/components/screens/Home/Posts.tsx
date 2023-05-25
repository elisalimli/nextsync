import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useFragment } from "../../../gql";
import {
  Post_Fragment,
  postsQueryDocument,
} from "../../../graphql/query/post/posts";
import Post from "./Post";
import { clearAuthState } from "../../../auth/auth";
import { logoutMutationDocument } from "../../../graphql/mutation/user/logout";
import HomeHeader from "./HomeHeader";

function ListHeader() {
  const [logout] = useMutation(logoutMutationDocument, {
    update(cache) {
      cache.modify({
        fields: {
          me() {
            return null;
          },
        },
      });
    },
  });
  return (
    <View>
      <TouchableOpacity
        onPress={async () => {
          const { data } = await logout({});
          // if logout is successful, we clear the auth state
          if (data?.logout) {
            await clearAuthState();
          }
        }}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
      <Text className="text-2xl font-bold">Recent Posts</Text>
    </View>
  );
}

const POSTS_LIMIT = 5;

function Posts() {
  const { data, loading, error, fetchMore } = useQuery(postsQueryDocument, {
    variables: { input: { limit: POSTS_LIMIT } },
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
          ListHeaderComponent={ListHeader}
          onEndReached={() => {
            const posts = useFragment(Post_Fragment, data?.posts);
            fetchMore({
              variables: {
                input: {
                  cursor: posts[posts?.length - 1].createdAt,
                  limit: POSTS_LIMIT,
                },
              },
            });
          }}
          scrollEventThrottle={16}
          onEndReachedThreshold={0.5}
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
