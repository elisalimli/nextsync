import { Dimensions, Platform } from "react-native";
import RNFS from "react-native-fs";

const { width, height } = Dimensions.get("screen");

export const constants = {
  apiBase:
    // Platform.OS === "ios" ? "http://localhost:4000" : "http://10.0.2.2:4000",
    Platform.OS === "ios"
      ? "http://localhost:4000"
      : "http://192.168.100.7:4000",
  // "http://104.248.245.135:4000",
  apiGraphql: "/query",
  ACCESS_TOKEN_KEY: "accessToken",
  folderPath: Platform.select({
    android: `${RNFS.ExternalStorageDirectoryPath}/Download/nextsync`,
    ios: `${RNFS.DocumentDirectoryPath}/Documents`,
  }),
  POSTS_QUERY_LIMIT: 50,
  SCREEN_WIDTH: width,
  SCREEN_HEIGHT: height,
  NEWS_TAG_CODE: "NEWS",
};

export const GRAPHQL_ENDPOINT = constants.apiBase + constants.apiGraphql;
