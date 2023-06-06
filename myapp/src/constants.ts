import { Dimensions, Platform } from "react-native";
import RNFS from "react-native-fs";

const { width, height } = Dimensions.get("screen");

export const constants = {
  apiBase:
    Platform.OS === "ios" ? "http://localhost:4000" : "http://10.0.2.2:4000",
  apiGraphql: "/graphql",
  ACCESS_TOKEN_KEY: "accessToken",
  folderPath: Platform.select({
    android: `${RNFS.ExternalStorageDirectoryPath}/Download/nextsync`,
    ios: `${RNFS.DocumentDirectoryPath}/Documents`,
  }),
  POSTS_QUERY_LIMIT: 12,

  SCREEN_WIDTH: width,
  SCREEN_HEIGHT: height,
};
