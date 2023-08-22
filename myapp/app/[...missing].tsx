import { SplashScreen, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { meQueryDocument } from "../src/graphql/query/user/me";
import { useQuery } from "@tanstack/react-query";
import { graphqlRequestClient } from "../src/graphql/requestClient";

export default function NotFoundScreen() {
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: async () => graphqlRequestClient.request(meQueryDocument),
    // networkMode: "offlineFirst",
  });

  useEffect(() => {
    if (data?.me) router?.replace("/");
  }, [data]);
  return <SplashScreen />;
}
