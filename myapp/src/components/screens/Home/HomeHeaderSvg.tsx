import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

interface HomeHeaderSvgProps {}

const HomeHeaderSvg = (props: HomeHeaderSvgProps) => {
  return (
    <Svg
      fill="none"
      height={20}
      data-name="Layer 1"
      viewBox="0 0 1200 100"
      preserveAspectRatio="none"
    >
      <Path d="M1200 0L0 0 598.97 50.72 1200 0z" fill={"#121221"}></Path>
    </Svg>
  );
};

export default HomeHeaderSvg;
