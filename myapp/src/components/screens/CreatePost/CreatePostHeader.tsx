import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { View } from "react-native";
import LogoSvg from "../../../../assets/svgs/full-logo.svg";
import BackButton from "../../BackButton";

const CreatePostHeader = () => {
  return (
    <View className="flex-row">
      <BackButton containerProps={{ className: "flex-1" }}>
        <Ionicons name="chevron-back-sharp" size={24} color="black" />
      </BackButton>
      <LogoSvg width="50%" height="100%" className="flex-10" />
      <View className="flex-1"></View>
    </View>
  );
};

export default CreatePostHeader;
