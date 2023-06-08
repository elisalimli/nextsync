import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { HEADER_HEIGHT_EXPANDED } from "../../../animation/useAnimatedHeaderStyles";

interface HomeNoResultsProps {}

const HomeNoResults = (props: HomeNoResultsProps) => {
  return (
    <View
      className="justify-center items-center flex-1"
      style={{ paddingTop: HEADER_HEIGHT_EXPANDED }}
    >
      <Text className="text-red-500">
        Axtarışa uyğun heç bir nəticə tapılmadı.
      </Text>
    </View>
  );
};

export default HomeNoResults;
