import { useQuery } from "@apollo/client";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { User_Fragment, meQueryDocument } from "../../../graphql/query/user/me";
import { AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFragment } from "../../../gql";
import Input from "../../Form/Input";

import { useForm } from "react-hook-form";
import { Animated } from "react-native";
import { useRouter } from "expo-router";
import Svg, {
  Circle,
  Ellipse,
  G,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
  SvgCss,
} from "react-native-svg";
import HomeHeaderSvg from "./HomeHeaderSvg";

interface HomeHeaderProps {}

const xml = `
  
<svg width="475" height="191" viewBox="0 0 475 191" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_484_843)">
<path d="M-7.45521 16.4572C-8.29341 2.10167 3.12226 -10 17.5023 -10H363.357C377.789 -10 389.224 2.18605 388.306 16.5892L379.324 157.614C378.557 169.653 369.302 179.428 357.323 180.851L284.5 189.5L238.5 191.5H192H146L97.5 189.5L22.8465 180.819C10.7912 179.417 1.48412 169.559 0.776695 157.443L-7.45521 16.4572Z" fill="#2F2E41"/>
</g>

</svg>


`;

const HomeHeader = (props: HomeHeaderProps) => {
  const router = useRouter();
  const { control } = useForm();
  const { data } = useQuery(meQueryDocument, {
    nextFetchPolicy: "cache-only", // Used for subsequent executions
  });

  const user = useFragment(User_Fragment, data?.me);

  const insets = useSafeAreaInsets();

  const [openSearch, setOpenSearch] = useState(false);

  const handleAddPress = () => {
    router.push("/post/createPost");
  };
  console.log(Dimensions.get("screen").height * 0.25);
  const handleSearchPress = () => {
    setOpenSearch((prevState) => !prevState);
    Animated.timing(searchAnimation, {
      toValue: openSearch ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const searchAnimation = useRef(new Animated.Value(0)).current;

  const searchBarOpacity = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const closedSearchBarOpacity = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const actionBarClassname =
    "flex-1 flex-row items-center justify-between absolute w-full h-full";

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const svgWidth = screenWidth;
  const svgHeight = screenHeight * 0.25; // Adjust the percentage as needed

  const viewBox = `0 0 ${screenWidth} ${svgHeight}`;
  const squareSize = Dimensions.get("screen").width; // Adjust the size of the square as needed

  return (
    <View>
      <StatusBar style="light" />
      <View
        style={
          [
            // StyleSheet.absoluteFill,
            // { alignItems: "center", justifyContent: "center" },
          ]
        }
      >
        {/* <View
          style={{ paddingTop: insets.top + 10 }}
          className="w-full h-[90px] bg-primary"
        ></View> */}

        {/* <LOGOSVG width="100%" height="70%" /> */}
        {/* <SvgCss xml={xml} width="100%" height="57%" /> */}
        {/* <View className="bg-primary" style={{ height: insets.top + 10 }}></View> */}
        {/* <Svg
          width={Dimensions.get("screen").width - 25}
          // height="219"
          height={Dimensions.get("screen").height * 0.25 - 30}
          viewBox={`0 0 375 ${Dimensions.get("screen").height * 0.2 + 10}`}
          fill="none"
          // xmlns="http://www.w3.org/2000/svg"
        >
          <G clipPath="url(#clip0_484_843)">
            <Path
              d="M-7.45521 16.4572C-8.29341 2.10167 3.12226 -10 17.5023 -10H363.357C377.789 -10 389.224 2.18605 388.306 16.5892L379.324 157.614C378.557 169.653 369.302 179.428 357.323 180.851L284.5 189.5L238.5 191.5H192H146L97.5 189.5L22.8465 180.819C10.7912 179.417 1.48412 169.559 0.776695 157.443L-7.45521 16.4572Z"
              fill="#2F2E41"
            />
          </G>
        </Svg> */}
        <View
          style={{
            width: "100%",
            backgroundColor: "#2F2E41",
            paddingTop: insets.top + 10,
          }}
        >
          <View className="px-5">
            <View className="w-full h-12">
              <Animated.View
                style={{ opacity: searchBarOpacity }}
                className={actionBarClassname}
              >
                <Input
                  containerClassName="flex-1"
                  className="bg-white p-2 rounded-lg"
                  name="search"
                  control={control}
                  placeholder="Search..."
                />
                <TouchableOpacity onPress={handleSearchPress} className="ml-2">
                  <AntDesign name="close" size={24} color="white" />
                </TouchableOpacity>
              </Animated.View>
              <Animated.View
                style={{ opacity: closedSearchBarOpacity }}
                className={actionBarClassname}
              >
                <TouchableOpacity onPress={handleAddPress}>
                  <AntDesign name="plus" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSearchPress}>
                  <AntDesign name="search1" size={24} color="white" />
                </TouchableOpacity>
              </Animated.View>
            </View>
            <View className="flex justify-center items-center mb-6">
              <Text className="text-white text-3xl font-bold">
                Hi, {user?.username}
              </Text>
            </View>
          </View>
        </View>
        <HomeHeaderSvg />
      </View>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {},
});
