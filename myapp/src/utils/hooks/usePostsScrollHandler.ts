import {
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { clamp } from "../clamp";

export const useScrollHandler = () => {
  const translationDiffY = useSharedValue(0);
  const translationY = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler<{ prevY?: number }>({
    onBeginDrag: (event, ctx) => {
      ctx.prevY = event.contentOffset.y;
    },
    onScroll: (event, ctx) => {
      let { y } = event.contentOffset;
      translationY.value = withTiming(event.contentOffset.y, { duration: 50 });
      if (y < 0) y = 0;

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
    scrollHandler,
  };
};
