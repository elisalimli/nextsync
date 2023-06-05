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
import { createUploadLink } from "apollo-upload-client";

// const BACKEND_URI = "http://localhost:4000/query";
const BACKEND_URI = "http://192.168.100.7:4000/query";
async function refreshAuth() {
  const query = JSON.stringify({
    query: refreshTokenMutationDocument,
  });

  const response = await fetch(BACKEND_URI, {
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
  uri: BACKEND_URI,
  credentials: "include",
});

const uploadLink = createUploadLink({
  uri: BACKEND_URI,
  credentials: "include",
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await getAuthAccessToken();
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
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch (err?.extensions?.code) {
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
  // link: ApolloLink.from([errorLink, authLink, httpLink, uploadLink]),
  link: ApolloLink.from([errorLink, authLink, uploadLink as any]),

  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: ["tagIds"],

            merge(existing, incoming) {
              // return  incoming;
              return [...(existing || []), ...incoming];
            },

            // If you always want to return the whole list, you can omit
            // this read function.
            read(existing) {
              return existing;
            },
          },
        },
      },
    },
  }),
});
