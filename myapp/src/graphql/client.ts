import { getAuthAccessToken } from "../auth/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { graphqlRequestClient } from "./requestClient";

import { isTokenExpired } from "../auth/isTokenExpired";
import { refreshToken } from "../auth/refreshToken";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },

    mutations: {
      onMutate: async (variables) => {
        console.log("refreshing token if expired");
        const token = await getAuthAccessToken();
        if (token && isTokenExpired(token)) await refreshToken();
      },
    },
  },
  queryCache: new QueryCache({
    onError: async (error: any) => {
      const token = await getAuthAccessToken();
      if (
        token &&
        error?.response?.errors[0]?.extensions?.code === "UNAUTHENTICATED"
      )
        refreshToken();
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
