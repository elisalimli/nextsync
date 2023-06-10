import AsyncStorage from "@react-native-async-storage/async-storage";
import { constants } from "../constants";
import { graphqlRequestClient } from "../graphql/requestClient";
// import { AuthState } from "./createUrqlClient";

export const saveAuthAccessToken = async (token: string) => {
  await AsyncStorage.setItem(constants.ACCESS_TOKEN_KEY, token);
  graphqlRequestClient.setHeader("Authorization", `Bearer ${token}`);
};
export const clearAuthState = async () => {
  await AsyncStorage.removeItem(constants.ACCESS_TOKEN_KEY);
  graphqlRequestClient.setHeader("Authorization", "");
};
export const getAuthAccessToken = () =>
  AsyncStorage.getItem(constants.ACCESS_TOKEN_KEY);
