import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useMutation } from "@apollo/client";
import React from "react";
import { clearAuthState } from "../../src/auth/auth";
import HomeHeader from "../../src/components/screens/Home/HomeHeader";
import Posts from "../../src/components/screens/Home/Posts";
import { logoutMutationDocument } from "../../src/graphql/mutation/user/logout";

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
