import { useQuery } from "@apollo/client";
import { SplashScreen, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { meQueryDocument } from "../src/graphql/query/user/me";

export default function NotFoundScreen() {
  const router = useRouter();
  const { data } = useQuery(meQueryDocument, {
    nextFetchPolicy: "cache-only", // Used for subsequent executions
  });

  useEffect(() => {
    if (data?.me) router?.replace("/");
  }, [data]);
  return <SplashScreen />;
}
