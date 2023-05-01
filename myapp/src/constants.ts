import { Platform } from "react-native";

export const constants = {
  apiBase:
    Platform.OS === "ios" ? "http://localhost:4000" : "http://10.0.2.2:4000",
  apiGraphql: "/graphql",
  ACCESS_TOKEN_KEY: "accessToken",
};
