import { constants } from "../constants";

export const guidelineBaseWidth = 375;
export const guidelineBaseHeight = 812;

export const horizontalScale = (size: number) =>
  (constants.SCREEN_WIDTH / guidelineBaseWidth) * size;
export const verticalScale = (size: number) =>
  (constants.SCREEN_HEIGHT / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;
