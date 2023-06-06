import { useQuery } from "@apollo/client";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import ReAnimated from "react-native-reanimated";
import HomeHeader from "../../src/components/screens/Home/HomeHeader";
import ListHeader from "../../src/components/screens/Home/LIstHeader";
import Post from "../../src/components/screens/Home/Post";
import { constants } from "../../src/constants";
import { useFragment } from "../../src/gql";
import {
  Post_Fragment,
  postsQueryDocument,
} from "../../src/graphql/query/post/posts";
import { useSearchStore } from "../../src/stores/searchStore";
import { useScrollHandler } from "../../src/utils/hooks/usePostsScrollHandler";
import { HEADER_HEIGHT_EXPANDED } from "../../src/animation/useAnimatedHeaderStyles";

const App = () => {
  const { activeTagIds } = useSearchStore();
  const [isFilterTagsCalled, setFilterTagsCalled] = useState(false);

  const {
    translationY,
    translationDiffY,
    insets,
    animatedHeaderStyles,
    scrollHandler,
  } = useScrollHandler();

  const { data, loading, error, fetchMore, refetch } = useQuery(
    postsQueryDocument,
    {
      variables: { input: { limit: constants.POSTS_QUERY_LIMIT } },
    }
  );

  useEffect(() => {
    // filtering posts when tags changed
    if (activeTagIds?.length || isFilterTagsCalled) {
      refetch({
        input: {
          limit: constants.POSTS_QUERY_LIMIT,
          tagIds: activeTagIds,
        },
      });
    } else setFilterTagsCalled(true);
  }, [activeTagIds?.length]);

  const handleEndReached = async () => {
    console.log("hasMOre", data?.posts?.hasMore);
    // if (data?.posts?.posts?.length)
    if (data?.posts?.hasMore && data?.posts?.posts) {
      const lastPost = useFragment(
        Post_Fragment,
        data.posts.posts[data.posts.posts.length - 1]
      );
      await fetchMore({
        variables: {
          input: {
            cursor: lastPost!.createdAt,
            limit: constants.POSTS_QUERY_LIMIT,
            tagIds: activeTagIds,
          },
        },
      });
    }
  };

  if (error) {
    return <Text>Something went wrong while retrieving posts</Text>;
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

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
        {data?.posts?.posts && data?.posts?.posts?.length > 0 && !loading ? (
          <ReAnimated.FlatList
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            // contentContainerStyle={{ paddingTop: 200 }}
            ListHeaderComponent={ListHeader}
            onEndReached={handleEndReached}
            ListFooterComponent={() => {
              return data?.posts?.hasMore ? (
                <Text style={{ paddingBottom: HEADER_HEIGHT_EXPANDED + 20 }}>
                  loading..
                </Text>
              ) : null;
            }}
            onEndReachedThreshold={0.5}
            style={[
              {
                flexGrow: 1,
              },
              animatedHeaderStyles,
            ]}
            // data={data?.posts}
            data={data?.posts?.posts}
            // renderItem={({ item }) => <Post {...item} />}
            renderItem={({ item }) => <Post {...item} />}
            keyExtractor={(item: any) => item?.id}
          />
        ) : (
          <View
            className="justify-center items-center flex-1"
            style={{ paddingTop: HEADER_HEIGHT_EXPANDED }}
          >
            <Text className="text-red-500">
              Axtarışa uyğun heç bir nəticə tapılmadı.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default App;
