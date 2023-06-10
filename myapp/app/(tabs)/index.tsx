import { StatusBar } from "expo-status-bar";
import React, { useRef } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { HEADER_HEIGHT_EXPANDED } from "../../src/animation/useAnimatedHeaderStyles";
import HomeHeader from "../../src/components/screens/Home/HomeHeader";
import HomeNoResults from "../../src/components/screens/Home/HomeNoResults";
import ListHeader from "../../src/components/screens/Home/LIstHeader";
import Post from "../../src/components/screens/Home/Post";
import { useGetPosts } from "../../src/utils/hooks/useGetPosts";
import { useScrollHandler } from "../../src/utils/hooks/usePostsScrollHandler";
import { useSearchPosts } from "../../src/utils/hooks/useSearchPosts";

const App = () => {
  const flatListRef = useRef<FlatList>(null);
  const { allItems, lastPage, isLoading, error, refetch, handleOnEndReached } =
    useGetPosts();
  const {
    translationY,
    translationDiffY,
    insets,
    animatedHeaderStyles,
    scrollHandler,
  } = useScrollHandler();

  useSearchPosts(refetch, flatListRef);
  let body = null;

  if (error) {
    console.log("error", error);
    body = <Text>Something went wrong while retrieving posts</Text>;
  } else if (isLoading) {
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
  } else if (lastPage?.posts?.posts?.length != 0 && !isLoading) {
    body = (
      // <Text>hello</Text>
      <Animated.FlatList
        ref={flatListRef as any}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        // contentContainerStyle={{ paddingTop: HEADER_HEIGHT_EXPANDED }}
        ListHeaderComponent={ListHeader}
        onEndReached={handleOnEndReached}
        bounces={false}
        ListFooterComponent={() => {
          return lastPage?.posts?.hasMore ? (
            <ActivityIndicator className="my-4" size={"large"} />
          ) : null;
        }}
        onEndReachedThreshold={0.5}
        // onEndReachedThreshold={0.9}
        style={[
          {
            flexGrow: 1,
          },
          animatedHeaderStyles,
        ]}
        // data={data?.posts}
        data={allItems}
        // renderItem={({ item }) => <Post {...item} />}
        renderItem={({ item }) => <Post {...item} />}
        keyExtractor={(item: any) => item?.id}
      />
    );
  } else {
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

      <View className="flex-1">{body}</View>
    </View>
  );
};

export default App;
