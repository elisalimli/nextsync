import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { clearAuthState } from "../../../auth/auth";
import { logoutMutationDocument } from "../../../graphql/mutation/user/logout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlRequestClient } from "../../../graphql/requestClient";
import { useRouter } from "expo-router";

function ListHeader() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation(
    () => graphqlRequestClient.request(logoutMutationDocument),
    {
      onSuccess: async (data) => {
        if (data?.logout) {
          await clearAuthState();
          queryClient.resetQueries({
            queryKey: ["me"],
          });
          router?.replace("/login");
        }
      },
    }
  );

  const handleLogout = async () => {
    const data = await mutation.mutateAsync();
    // if logout is successful, we clear the auth state
    if (data?.logout) await clearAuthState();
  };

  return (
    <View className="px-2">
      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <Text className="text-2xl font-bold">Recent Posts</Text>
    </View>
  );
}

export default ListHeader;
