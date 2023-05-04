import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import React from "react";
import { clearAuthState } from "../../src/auth/auth";
import { logoutMutationDocument } from "../../src/graphql/mutation/user/logout";
import { useMutation } from "@apollo/client";
import Button from "../../components/Button";

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
    <View style={styles.container}>
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
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl text-orange-700 ">
          Open up App.js to start working on your app!
        </Text>
      </View>

      <Button variant="primary">Test</Button>
      <Text style={styles.title}>Tab One</Text>
      <EditScreenInfo path="app/(tabs)/index.tsx" />
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
