import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { IDoc } from "../../../../stores/createPostStore";
import Seperator from "../../../Seperator";
import DeleteButton, { MAX_TRANSLATEX_THRESHOLD } from "./DeleteButton";
import ListItem from "./ListItem";

type ICreatePostDocProps = RenderItemParams<IDoc>;

const LIST_ITEM_HEIGHT = 70;

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const CreatePostDoc = ({ item, drag, isActive }: ICreatePostDocProps) => {
  const { name } = item.doc;

  const itemHeight = useSharedValue(LIST_ITEM_HEIGHT);
  const seperatorHeight = useSharedValue(1);
  const startX = useSharedValue(0);
  const translationX = useSharedValue(0);

  const animatedContainerStyles = useAnimatedStyle(() => {
    return {
      height: itemHeight.value,
      transform: [{ translateX: translationX.value }],
    };
  });

  const animatedStylesSeperator = useAnimatedStyle(() => {
    return {
      height: seperatorHeight.value,
    };
  });

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translationX.value = Math.min(e.translationX + startX.value, 0);
    })
    .onEnd(() => {
      if (translationX.value < -MAX_TRANSLATEX_THRESHOLD) {
        translationX.value = withTiming(-MAX_TRANSLATEX_THRESHOLD);
        startX.value = -MAX_TRANSLATEX_THRESHOLD;
      } else {
        translationX.value = withTiming(0);
        startX.value = 0;
      }
    })
    .activeOffsetX([-10, 10]);

  return (
    <View>
      <ScaleDecorator>
        <DeleteButton
          doc={item.doc}
          itemHeight={itemHeight}
          seperatorHeight={seperatorHeight}
          translationX={translationX}
        />

        <Animated.View
          style={[animatedContainerStyles, { justifyContent: "center" }]}
        >
          {/* Drag To Sort */}
          <AnimatedTouchableOpacity onLongPress={drag} disabled={isActive}>
            {/* Swipe Left Gesture */}
            <GestureDetector gesture={gesture}>
              <Animated.View style={[{ justifyContent: "center" }]}>
                <ListItem fileName={name} />
              </Animated.View>
            </GestureDetector>
          </AnimatedTouchableOpacity>
          <Seperator isAnimated style={[animatedStylesSeperator]} />
        </Animated.View>
      </ScaleDecorator>
    </View>
  );
};

export default CreatePostDoc;
