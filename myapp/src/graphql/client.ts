import { saveAuthAccessToken } from "../auth/auth";

import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
  fromPromise,
  useMutation,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getAuthAccessToken } from "../auth/auth";
import { onError } from "@apollo/client/link/error";
import { meQueryDocument } from "./query/user/me";
import { refreshTokenMutationDocument } from "./mutation/user/refreshToken";

async function refreshAuth() {
  const query = JSON.stringify({
    query: refreshTokenMutationDocument,
  });

  const response = await fetch("http://localhost:4000/query", {
    headers: { "content-type": "application/json" },

    method: "POST",
    body: query,
    credentials: "include",
  });

  const responseJson = await response.json();
  if (responseJson.data?.refreshToken?.authToken) {
    // Update our local variables and write to our storage
    const token = responseJson.data.refreshToken.authToken!.token as string;
    await saveAuthAccessToken(token);
    return token;
  }
  return null;
}
const httpLink = createHttpLink({
  uri: "http://localhost:4000/query",
  credentials: "include",
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await getAuthAccessToken();
  console.log("fired", token);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    const { cache } = operation.getContext();

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.log("errors", err.extensions);
        switch (err.extensions.code) {
          case "UNAUTHENTICATED":
            return fromPromise(refreshAuth())
              .filter((value) => Boolean(value))
              .flatMap((accessToken) => {
                const oldHeaders = operation.getContext().headers;
                // modify the operation context with a new token
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${accessToken}`,
                  },
                });

                // retry the request, returning the new observable
                return forward(operation);
              });
        }
      }
    }
  }
);

export const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),

  cache: new InMemoryCache(),
});
