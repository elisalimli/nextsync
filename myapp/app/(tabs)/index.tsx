import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

import EditScreenInfo from "../../src/components/EditScreenInfo";
import React from "react";
import { clearAuthState } from "../../src/auth/auth";
import { logoutMutationDocument } from "../../src/graphql/mutation/user/logout";
import { useMutation, useQuery } from "@apollo/client";
import Button from "../../src/components/Button";
import Posts from "../../src/components/screens/Home/Posts";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  User_Fragment,
  meQueryDocument,
} from "../../src/graphql/query/user/me";
import { useFragment } from "../../src/gql";
import { AntDesign } from "@expo/vector-icons";
import HomeHeader from "../../src/components/screens/Home/HomeHeader";

export default function TabOneScreen() {
  const [logout] = useMutation(logoutMutationDocument, {
    update(cache) {
      cache.modify({
        fields: {
          me() {
            return null;
          },
        },
      });
    },
  });
  return (
    <View className="flex-1 ">
      <HomeHeader />

      <View className="flex-1">
        <View className="p-4">
          <TouchableOpacity
            onPress={async () => {
              const { data } = await logout({});
              // if logout is successful, we clear the auth state
              if (data?.logout) {
                await clearAuthState();
              }
            }}
          >
            <Text>Logout</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold">Recent Posts</Text>
        </View>

        <Posts />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
