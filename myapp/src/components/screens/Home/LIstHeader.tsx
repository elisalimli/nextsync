import { useMutation } from "@apollo/client";
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { clearAuthState } from "../../../auth/auth";
import { logoutMutationDocument } from "../../../graphql/mutation/user/logout";

function ListHeader() {
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

  const handleLogout = async () => {
    const { data } = await logout({});
    // if logout is successful, we clear the auth state
    if (data?.logout) {
      await clearAuthState();
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <Text className="text-2xl font-bold">Recent Posts</Text>
    </View>
  );
}

export default ListHeader;
