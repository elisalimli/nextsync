import React from "react";
import { Text, View } from "../../components/Themed";
import {
  User_Fragment,
  meQueryDocument,
} from "../../src/graphql/query/user/me";
import { useQuery } from "@apollo/client";
import { useFragment } from "../../src/gql";

export default function TabTwoScreen() {
  const { data } = useQuery(meQueryDocument, {});

  const user = useFragment(User_Fragment, data?.me);
  return (
    <View>
      <Text>Hello, {user?.username}</Text>
      <Text>Tab Two</Text>
    </View>
  );
}
