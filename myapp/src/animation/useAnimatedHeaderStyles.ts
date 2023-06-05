import {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { HomeHeaderAnimatedProps } from "../components/screens/Home/HomeHeader";
import { constants } from "../constants";
import { verticalScale } from "../utils/responsive";

export const HEADER_HEIGHT_EXPANDED = verticalScale(200);
export const SEARCH_BAR_PADDING_HORIZONTAL = 16;
const HEADER_HEIGHT_NARROWED = verticalScale(85);
// const HEADER_HEIGHT_TAGS = verticalScale(85);

export const useAnimatedHeaderStyles = ({
  scrollDiffY,
  scrollY,
}: HomeHeaderAnimatedProps) => {
  const tagsHeight = useSharedValue(0);
  const translateSearch = useSharedValue(constants.SCREEN_WIDTH);

  const animatedHeaderStyles = useAnimatedStyle(() => {
    const headerHeight = interpolate(
      scrollY.value,
      [0, 100],
      [
        HEADER_HEIGHT_EXPANDED + tagsHeight.value,
        HEADER_HEIGHT_NARROWED + tagsHeight.value,
      ],
      {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      }
    );
    const headerY = interpolate(
      scrollDiffY.value,
      [0, HEADER_HEIGHT_NARROWED + tagsHeight.value],
      [0, -(HEADER_HEIGHT_EXPANDED + tagsHeight.value)],
      {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      }
    );

    return {
      height: headerHeight,
      transform: [{ translateY: headerY }],
    };
  });

  return {
    animatedHeaderStyles,
    tagsHeight,
    translateSearch,
  };
};
