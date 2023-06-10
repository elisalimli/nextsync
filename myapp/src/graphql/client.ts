import { saveAuthAccessToken } from "../auth/auth";

import { getAuthAccessToken } from "../auth/auth";
import { refreshTokenMutationDocument } from "./mutation/user/refreshToken";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { graphqlRequestClient } from "./requestClient";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
  queryCache: new QueryCache({
    onError: async (error: any) => {
      const token = await getAuthAccessToken();
      if (
        token &&
        error?.response?.errors[0]?.extensions?.code === "UNAUTHENTICATED"
      ) {
        const data = await graphqlRequestClient.request(
          refreshTokenMutationDocument
        );
        const token = data?.refreshToken?.authToken?.token;
        if (token) {
          await saveAuthAccessToken(token);
          queryClient.invalidateQueries({ queryKey: ["me"] });
        }
      }
    },
  }),
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

const setAuthHeaders = async () => {
  const token = await getAuthAccessToken();
  if (token) graphqlRequestClient.setHeader("Authorization", `Bearer ${token}`);
};

setAuthHeaders();
