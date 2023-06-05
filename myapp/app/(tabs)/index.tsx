import { useQuery } from "@apollo/client";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, View } from "react-native";
import ReAnimated from "react-native-reanimated";
import HomeHeader, {
  HEADER_HEIGHT_EXPANDED,
} from "../../src/components/screens/Home/HomeHeader";
import ListHeader from "../../src/components/screens/Home/LIstHeader";
import Post from "../../src/components/screens/Home/Post";
import { constants } from "../../src/constants";
import { useFragment } from "../../src/gql";
import {
  Post_Fragment,
  postsQueryDocument,
} from "../../src/graphql/query/post/posts";
import { useSearchStore } from "../../src/stores/search";
import { useScrollHandler } from "../../src/utils/hooks/usePostsScrollHandler";

const App = () => {
  const { tags } = useSearchStore();

  const {
    translationY,
    translationDiffY,
    insets,
    animatedHeaderStyles,
    scrollHandler,
  } = useScrollHandler();

  const { data, loading, error, fetchMore } = useQuery(postsQueryDocument, {
    variables: { input: { limit: constants.POSTS_QUERY_LIMIT } },
  });

  if (error) {
    return <Text>Something went wrong while retrieving posts</Text>;
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const handleEndReached = async () => {
    const posts = useFragment(Post_Fragment, data?.posts);
    if (posts)
      await fetchMore({
        variables: {
          input: {
            cursor: posts[posts?.length - 1].createdAt,
            limit: constants.POSTS_QUERY_LIMIT,
            tagIds: tags,
          },
        },
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <HomeHeader scrollY={translationY} scrollDiffY={translationDiffY} />
      <StatusBar style={"light"} />
      {/* custom status bar */}
      <View
        style={{
          height: insets.top,
        }}
        className="bg-primary w-full z-20"
      />

      <View className="flex-1">
        {data?.posts && (
          <ReAnimated.FlatList
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            // contentContainerStyle={{ paddingTop: 200 }}
            ListHeaderComponent={ListHeader}
            onEndReached={handleEndReached}
            ListFooterComponent={() => {
              return (
                <Text style={{ paddingBottom: HEADER_HEIGHT_EXPANDED + 20 }}>
                  loading..
                </Text>
              );
            }}
            onEndReachedThreshold={0.5}
            style={[
              {
                flexGrow: 1,
              },
              animatedHeaderStyles,
            ]}
            // data={data?.posts}
            data={data?.posts}
            // renderItem={({ item }) => <Post {...item} />}
            renderItem={({ item }) => <Post {...item} />}
            keyExtractor={(item: any) => item?.id}
          />
        )}
      </View>
    </View>
  );
};

export default App;
