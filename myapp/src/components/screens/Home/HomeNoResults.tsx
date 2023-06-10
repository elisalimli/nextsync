import * as React from "react";
import { Text, View } from "react-native";
import Svg from "../../../../assets/svgs/NoPostsFound.svg";
import { HEADER_TAGS_HEIGHT_EXPANDED } from "../../../animation/useAnimatedHeaderStyles";

interface HomeNoResultsProps {}

const HomeNoResults = (props: HomeNoResultsProps) => {
  return (
    <View
      className="justify-center items-center flex-1"
      style={{ paddingTop: HEADER_TAGS_HEIGHT_EXPANDED / 2 }}
    >
      <Svg width="100%" height="40%" />

      <Text className="my-4 font-semibold">
        Axtarışa uyğun heç bir nəticə tapılmadı.
      </Text>
    </View>
  );
};

export default HomeNoResults;
