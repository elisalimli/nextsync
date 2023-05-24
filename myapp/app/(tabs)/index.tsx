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

const Header = ({ scrollY }) => {
  const animatedStyles = useAnimatedStyle(() => {
    const headerHeight = interpolate(scrollY.value, [0, 200], [200, 150], {
      extrapolateLeft: Extrapolation.CLAMP,
      extrapolateRight: Extrapolation.CLAMP,
    });

    return {
      height: headerHeight,
    };
  });
  const textAnimatedStyles = useAnimatedStyle(() => {
    const headerOpacity = interpolate(scrollY.value, [0, 200], [1, 0], {
      extrapolateLeft: Extrapolation.CLAMP,
      extrapolateRight: Extrapolation.CLAMP,
    });

    return {
      opacity: headerOpacity,
    };
  });

  return (
    <ReAnimated.View
      style={[
        {
          backgroundColor: "blue",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 96,
        },
        animatedStyles,
      ]}
    >
      <TextInput
        style={{
          height: 40,
          width: "80%",
          backgroundColor: "red",
          paddingHorizontal: 10,
        }}
        placeholder="Search"
      />
      <ReAnimated.Text style={textAnimatedStyles}>Hello Ali</ReAnimated.Text>
    </ReAnimated.View>
  );
};

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
      translationY.value = withTiming(event.contentOffset.y, { duration: 10 });
      if (y < 0) {
        y = 0;
      }
      const dy = y - (ctx?.prevY ?? 0);
      translationDiffY.value = withTiming(
        clamp(translationDiffY.value + dy, 0, 50),
        { duration: 10 }
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
            onEndReachedThreshold={0.1}
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

// Expo SDK41
// expo-blur: ~9.0.3

// import React, { useRef } from "react";
// import {
//   Animated,
//   Dimensions,
//   Image,
//   ImageBackground,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import { Feather } from "@expo/vector-icons";
// import {
//   SafeAreaProvider,
//   useSafeAreaInsets,
// } from "react-native-safe-area-context";
// import { BlurView } from "expo-blur";

// function generateTweets(limit) {
//   return new Array(limit).fill(0).map((_, index) => {
//     const repetitions = Math.floor(Math.random() * 3) + 1;

//     return {
//       key: index.toString(),
//       text: "Lorem ipsum dolor amet ".repeat(repetitions),
//       author: "Arnaud",
//       tag: "eveningkid",
//     };
//   });
// }

// const TWEETS = generateTweets(30);

// const PROFILE_PICTURE_URI =
//   "https://pbs.twimg.com/profile_images/975388677642715136/7Hw2MgQ2_400x400.jpg";

// const PROFILE_BANNER_URI =
//   "https://pbs.twimg.com/profile_banners/1584941134203289601/1682276719/1500x500";

// const AnimatedImageBackground =
//   Animated.createAnimatedComponent(ImageBackground);

// const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// export default function WrappedApp() {
//   // Keeps notches away
//   return (
//     <SafeAreaProvider>
//       <App />
//     </SafeAreaProvider>
//   );
// }

// function App() {
//   const insets = useSafeAreaInsets();
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const HEADER_HEIGHT_EXPANDED = 35;
//   const HEADER_HEIGHT_NARROWED =
//     Dimensions.get("screen").height * 0.1 + insets.top / 2;

//   console.log("insets", insets.top);

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {/* Name + tweets count */}
//       <Animated.View
//         style={{
//           zIndex: 5,
//           position: "absolute",
//           backgroundColor: "red",
//           top: 0,
//           left: 0,
//           right: 0,
//           alignItems: "center",
//           paddingTop: insets.top + 20,
//           paddingBottom: 5,
//           // justifyContent: "flex-start",
//           opacity: scrollY.interpolate({
//             inputRange: [90, 110],
//             outputRange: [0, 1],
//           }),
//           transform: [
//             {
//               translateY: scrollY.interpolate({
//                 inputRange: [90, 120],
//                 outputRange: [30, 0],
//                 extrapolate: "clamp",
//               }),
//             },
//           ],
//         }}
//       >
//         <Text style={[styles.text, styles.username]}>Arnaud</Text>

//         <Text style={[styles.text, styles.tweetsCount]}>379 tweets</Text>
//       </Animated.View>

//       {/* Tweets/profile */}
//       <Animated.ScrollView
//         showsVerticalScrollIndicator={false}
//         onScroll={Animated.event(
//           [
//             {
//               nativeEvent: {
//                 contentOffset: { y: scrollY },
//               },
//             },
//           ],
//           { useNativeDriver: true }
//         )}
//         style={{
//           zIndex: 3,
//           // marginTop: HEADER_HEIGHT_NARROWED,
//           // paddingTop: HEADER_HEIGHT_EXPANDED,
//         }}
//       >
//         <View style={[styles.container, { backgroundColor: "black" }]}>
//           <View
//             style={[
//               styles.container,
//               {
//                 paddingHorizontal: 20,
//               },
//             ]}
//           >
//             <Text
//               style={[
//                 styles.text,
//                 {
//                   fontSize: 24,
//                   fontWeight: "bold",
//                   marginTop: 10,
//                 },
//               ]}
//             >
//               Arnaud
//             </Text>

//             <Text
//               style={[
//                 styles.text,
//                 {
//                   fontSize: 15,
//                   color: "gray",
//                   marginBottom: 15,
//                 },
//               ]}
//             >
//               @eveningkid
//             </Text>

//             <Text style={[styles.text, { marginBottom: 15, fontSize: 15 }]}>
//               Same @ on every social media
//             </Text>

//             {/* Profile stats */}
//             <View
//               style={{
//                 flexDirection: "row",
//                 marginBottom: 15,
//               }}
//             >
//               <Text
//                 style={[
//                   styles.text,
//                   {
//                     fontWeight: "bold",
//                     marginRight: 10,
//                   },
//                 ]}
//               >
//                 70{" "}
//                 <Text
//                   style={{
//                     color: "gray",
//                     fontWeight: "normal",
//                   }}
//                 >
//                   Following
//                 </Text>
//               </Text>

//               <Text style={[styles.text, { fontWeight: "bold" }]}>
//                 106{" "}
//                 <Text
//                   style={{
//                     color: "gray",
//                     fontWeight: "normal",
//                   }}
//                 >
//                   Followers
//                 </Text>
//               </Text>
//             </View>
//           </View>

//           <View style={styles.container}>
//             {TWEETS.map((item, index) => (
//               <View key={item.key} style={styles.tweet}>
//                 <Image
//                   source={{
//                     uri: PROFILE_PICTURE_URI,
//                   }}
//                   style={{
//                     height: 50,
//                     width: 50,
//                     borderRadius: 25,
//                     marginRight: 10,
//                   }}
//                 />

//                 <View style={styles.container}>
//                   <Text
//                     style={[
//                       styles.text,
//                       {
//                         fontWeight: "bold",
//                         fontSize: 15,
//                       },
//                     ]}
//                   >
//                     {item.author}{" "}
//                     <Text
//                       style={{
//                         color: "gray",
//                         fontWeight: "normal",
//                       }}
//                     >
//                       @{item.tag} · {index + 1}d
//                     </Text>
//                   </Text>

//                   <Text style={[styles.text, { fontSize: 15 }]}>
//                     {item.text}
//                   </Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         </View>
//       </Animated.ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   text: {
//     color: "white",
//   },
//   username: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: -3,
//   },
//   tweetsCount: {
//     fontSize: 13,
//   },
//   tweet: {
//     flexDirection: "row",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderTopWidth: StyleSheet.hairlineWidth,
//     borderTopColor: "rgba(255, 255, 255, 0.25)",
//   },
// });
