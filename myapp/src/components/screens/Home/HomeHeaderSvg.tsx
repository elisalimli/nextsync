import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

interface HomeHeaderSvgProps {}

const HomeHeaderSvg = (props: HomeHeaderSvgProps) => {
  return (
    <Svg
      height={30}
      data-name="Layer 1"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <Path d="M1200 0L0 0 598.97 60.72 1200 0z" fill={"#2F2E41"}></Path>
    </Svg>
  );
};

export default HomeHeaderSvg;
