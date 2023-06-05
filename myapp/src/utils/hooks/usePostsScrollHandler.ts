import {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HEADER_HEIGHT_EXPANDED } from "../../components/screens/Home/HomeHeader";
import { clamp } from "../clamp";

export const useScrollHandler = () => {
  const translationDiffY = useSharedValue(0);
  const translationY = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const animatedHeaderStyles = useAnimatedStyle(() => {
    const height = interpolate(
      translationY.value,
      [0, 100],
      [HEADER_HEIGHT_EXPANDED + 20, 20],
      {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      }
    );
    return {
      paddingTop: height,
    };
  });

  const scrollHandler = useAnimatedScrollHandler<{ prevY?: number }>({
    onBeginDrag: (event, ctx) => {
      ctx.prevY = event.contentOffset.y;
    },
    onScroll: (event, ctx) => {
      let { y } = event.contentOffset;
      translationY.value = withTiming(event.contentOffset.y, { duration: 50 });
      if (y < 0) {
        y = 0;
      }
      const dy = y - (ctx?.prevY ?? 0);
      translationDiffY.value = withTiming(
        clamp(translationDiffY.value + dy, 0, 50),
        { duration: 50 }
      );

      // the clamp function always returns a value between 0 and 50
      ctx.prevY = y;
    },
  });

  return {
    translationY,
    translationDiffY,
    insets,
    animatedHeaderStyles,
    scrollHandler,
  };
};
