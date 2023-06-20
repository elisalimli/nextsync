import React from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFragment } from "../../../gql";
import { User_Fragment, meQueryDocument } from "../../../graphql/query/user/me";

import Animated, { SharedValue } from "react-native-reanimated";
import { useAnimatedHeaderStyles } from "../../../animation/useAnimatedHeaderStyles";
import HeaderGreeting from "./HeaderGreeting";
import SearchBar from "./SearchBar";
import HomeHeaderActions from "./HomeHeaderActions";
import { useQuery } from "@tanstack/react-query";
import { graphqlRequestClient } from "../../../graphql/requestClient";

export interface HomeHeaderAnimatedProps {
  scrollY: SharedValue<number>;
  scrollDiffY: SharedValue<number>;
}
type HomeHeaderProps = {} & HomeHeaderAnimatedProps;

const HomeHeader = ({ scrollY, scrollDiffY }: HomeHeaderProps) => {
  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: async () => graphqlRequestClient.request(meQueryDocument),
  });
  const user = useFragment(User_Fragment, data?.me);
  const insets = useSafeAreaInsets();
  const { animatedHeaderStyles, tagsHeight, translateSearch } =
    useAnimatedHeaderStyles({ scrollDiffY, scrollY });

  return (
    <Animated.View
      style={[
        {
          paddingTop: insets.top,
        },
        animatedHeaderStyles,
      ]}
      className="bg-primary items-center justify-end absolute top-0 left-0 right-0 pb-3 z-10"
    >
      <SearchBar translateSearch={translateSearch} tagsHeight={tagsHeight} />
      <HeaderGreeting scrollY={scrollY} username={user?.username} />
      <HomeHeaderActions
        tagsHeight={tagsHeight}
        translateSearch={translateSearch}
      />
    </Animated.View>
  );
};

export default HomeHeader;
