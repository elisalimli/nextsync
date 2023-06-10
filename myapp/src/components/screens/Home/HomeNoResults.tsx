import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { HEADER_HEIGHT_EXPANDED } from "../../../animation/useAnimatedHeaderStyles";
import Svg from "../../../../assets/svgs/NoPostsFound.svg";

interface HomeNoResultsProps {}

const HomeNoResults = (props: HomeNoResultsProps) => {
  return (
    <View
      className="justify-center items-center flex-1"
      style={{ paddingTop: HEADER_HEIGHT_EXPANDED }}
    >
      {/* <SvgUri
        width="100%"
        height="20%"
        uri="../../../../assets/svgs/NoPostsFound.svg"
      /> */}
      <Svg width="100%" height="40%" />

      <Text className="my-4 font-semibold">
        Axtarışa uyğun heç bir nəticə tapılmadı.
      </Text>
    </View>
  );
};

export default HomeNoResults;
