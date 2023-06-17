import { refreshTokenMutationDocument } from "../graphql/mutation/user/refreshToken";
import { graphqlRequestClient } from "../graphql/requestClient";
import { saveAuthAccessToken } from "./auth";

export const refreshToken = async () => {
  const data = await graphqlRequestClient.request(refreshTokenMutationDocument);
  const token = data?.refreshToken?.authToken?.token;
  if (token) {
    await saveAuthAccessToken(token);
    // queryClient.invalidateQueries({ queryKey: ["me"] });
    // } else {
    // if could not get new access token, then reset cache
    // queryClient?.resetQueries();
  }
};
