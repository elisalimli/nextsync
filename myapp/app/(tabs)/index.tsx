import { useQuery } from "@apollo/client";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import Animated from "react-native-reanimated";
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
import { err } from "react-native-svg/lib/typescript/xml";
import HomeNoResults from "../../src/components/screens/Home/HomeNoResults";
const App = () => {
  const { activeTagIds, loading: searchLoading } = useSearchStore();
  const [isFilterTagsCalled, setFilterTagsCalled] = useState(false);
  const flatListRef = useRef<FlatList>(null);

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

  const isLoading = loading || searchLoading;

  useEffect(() => {
    // filtering posts when tags changed
    if (activeTagIds?.length || isFilterTagsCalled) {
      (async () => {
        await refetch({
          input: {
            limit: constants.POSTS_QUERY_LIMIT,
            tagIds: activeTagIds,
          },
        });
        console.log("refetching");
        // scrolling to top when data refetched
        if (flatListRef?.current)
          flatListRef.current.scrollToOffset({ animated: true, offset: 10 });
      })();
    } else setFilterTagsCalled(true);
  }, [activeTagIds?.length]);

  const handleEndReached = async () => {
    if (data?.posts?.hasMore && data?.posts?.posts) {
      const lastPost = useFragment(
        Post_Fragment,
        data.posts.posts[data.posts.posts.length - 1]
      );
      const cursor = lastPost!.createdAt;
      await fetchMore({
        variables: {
          input: {
            cursor,
            limit: constants.POSTS_QUERY_LIMIT,
            tagIds: activeTagIds,
          },
        },
      });
    }
  };

  let body = null;

  if (error) {
    console.log("error", error);
    body = <Text>Something went wrong while retrieving posts</Text>;
  }

  if (isLoading) {
    body = (
      <View
        className="items-center flex-1"
        style={{
          paddingTop: HEADER_HEIGHT_EXPANDED,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }
  console.log(data?.posts?.posts?.length);
  if (data?.posts?.posts && data?.posts?.posts?.length > 0 && !isLoading) {
    body = (
      // <Text>hello</Text>
      <Animated.FlatList
        ref={flatListRef as any}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT_EXPANDED }}
        ListHeaderComponent={ListHeader}
        onEndReached={() => handleEndReached()}
        bounces={false}
        ListFooterComponent={() => {
          return data?.posts?.hasMore && !error ? (
            <ActivityIndicator className="my-4" size={"large"} />
          ) : null;
        }}
        onEndReachedThreshold={0.5}
        // onEndReachedThreshold={0.9}
        // style={[
        //   {
        //     flexGrow: 1,
        //   },
        //   animatedHeaderStyles,
        // ]}
        // data={data?.posts}
        data={data?.posts?.posts}
        // renderItem={({ item }) => <Post {...item} />}
        renderItem={({ item }) => <Post {...item} />}
        keyExtractor={(item: any) => item?.id}
      />
    );
  }

  if (data?.posts?.posts?.length === 0 && !isLoading) {
    body = <HomeNoResults />;
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

      <View style={{}} className="flex-1">
        {body}
      </View>
    </View>
  );
};

export default App;
