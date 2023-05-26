// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// import { useMutation } from "@apollo/client";
// import React from "react";
// import { clearAuthState } from "../../src/auth/auth";
// import HomeHeader from "../../src/components/screens/Home/HomeHeader";
// import Posts from "../../src/components/screens/Home/Posts";
// import { logoutMutationDocument } from "../../src/graphql/mutation/user/logout";
// import HomeHeaderSvg from "../../src/components/screens/Home/HomeHeaderSvg";

// export default function TabOneScreen() {
//   return (
//     <View className="flex-1 ">
//       <HomeHeader />

//       <View classNa me="flex-1">
//         <Posts />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: "80%",
//   },
// });

import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  Animated,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import ReAnimated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Post from "../../src/components/screens/Home/Post";
import { useFragment } from "../../src/gql";
import {
  postsQueryDocument,
  Post_Fragment,
} from "../../src/graphql/query/post/posts";
import { clearAuthState } from "../../src/auth/auth";
import { logoutMutationDocument } from "../../src/graphql/mutation/user/logout";
import HomeHeader, {
  HEADER_HEIGHT_EXPANDED,
} from "../../src/components/screens/Home/HomeHeader";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

/**
* @summary Clamps a node with a lower and upper bound.
* @example
clamp(-1, 0, 100); // 0
clamp(1, 0, 100); // 1
clamp(101, 0, 100); // 100
* @worklet
*/
export const clamp = (
  value: number,
  lowerBound: number,
  upperBound: number
) => {
  "worklet";
  return Math.min(Math.max(lowerBound, value), upperBound);
};

const App = () => {
  const translationDiffY = useSharedValue(0);
  const translationY = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const animatedStyles = useAnimatedStyle(() => {
    const height = interpolate(
      translationY.value,
      [0, 100],
      [HEADER_HEIGHT_EXPANDED + 20, 20],
      {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      }
    );

    return {
      paddingTop: height,
    };
  });

  const scrollHandler = useAnimatedScrollHandler<{ prevY?: number }>({
    onBeginDrag: (event, ctx) => {
      ctx.prevY = event.contentOffset.y;
    },
    onScroll: (event, ctx) => {
      let { y } = event.contentOffset;
      translationY.value = withTiming(event.contentOffset.y, { duration: 50 });
      if (y < 0) {
        y = 0;
      }
      const dy = y - (ctx?.prevY ?? 0);
      translationDiffY.value = withTiming(
        clamp(translationDiffY.value + dy, 0, 50),
        { duration: 50 }
      );

      // the clamp function always returns a value between 0 and 50
      ctx.prevY = y;
    },
  });

  const { data, loading, error, fetchMore } = useQuery(postsQueryDocument, {
    variables: { input: { limit: 24 } },
  });
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
        {data?.posts && (
          <ReAnimated.FlatList
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            // contentContainerStyle={{ paddingTop: 200 }}
            ListHeaderComponent={ListHeader}
            onEndReached={async () => {
              const posts = useFragment(Post_Fragment, data?.posts);
              await fetchMore({
                variables: {
                  input: {
                    cursor: posts[posts?.length - 1].createdAt,
                    limit: 24,
                  },
                },
              });
            }}
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
              animatedStyles,
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
