import React from "react";
import { Dimensions, Text, TouchableOpacity } from "react-native";
import Animated, {
  withTiming,
  Easing,
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from "react-native-reanimated";
import {
  FileUpload,
  useCreatePostStore,
} from "../../../../stores/createPostStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
export const MAX_TRANSLATEX_THRESHOLD = SCREEN_WIDTH * 0.2;

interface IDeleteButtonProps {
  translationX: SharedValue<number>;
  itemHeight: SharedValue<number>;
  seperatorHeight: SharedValue<number>;
  doc: FileUpload;
}

const DeleteButton = ({
  translationX,
  itemHeight,
  seperatorHeight,
  doc,
}: IDeleteButtonProps) => {
  const { docs, setDocs } = useCreatePostStore();

  const removeDoc = () => {
    const newDocs = docs.filter((item) => item.doc.uri != doc.uri);
    setDocs(newDocs);
  };

  const handleDelete = () => {
    removeDoc();

    // Animation
    itemHeight.value = withTiming(0, {
      easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
    });
    seperatorHeight.value = withTiming(0);
  };

  const animatedDeleteButtonStyles = useAnimatedStyle(() => {
    const opacity = interpolate(
      translationX.value,
      [0, -MAX_TRANSLATEX_THRESHOLD],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
    return {
      width:
        translationX.value < 0
          ? Math.max(Math.abs(translationX.value), MAX_TRANSLATEX_THRESHOLD)
          : 0,
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: "100%",
          position: "absolute",
          top: 0,
          right: 0,
        },
        animatedDeleteButtonStyles,
      ]}
    >
      <TouchableOpacity
        onPress={handleDelete}
        style={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text className="text-red-500 font-semibold">DELETE</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default DeleteButton;
