import {
  GOOGLE_ANDROID_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
} from "@env";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { useAuth } from "../../../../context/auth";
import { saveAuthAccessToken } from "../../../auth/auth";
import { googleLoginOrSignUpMutationDocument } from "../../../graphql/mutation/user/googleLoginOrSignup";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { Text } from "../../Themed";
import { graphqlRequestClient } from "../../../graphql/requestClient";

WebBrowser.maybeCompleteAuthSession();

function GoogleLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { token } = useAuth();

  const { setToken } = useAuth();

  const mutation = useMutation(
    () =>
      graphqlRequestClient.request(googleLoginOrSignUpMutationDocument, {
        input: { token },
      }),
    {}
  );

  const [_, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    expoClientId: GOOGLE_IOS_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    async function handleLogin() {
      const res = await mutation.mutateAsync();
      const data = res?.googleLoginOrSignUp;

      // if response is ok, saving accessToken
      if (data?.ok && data?.authToken) {
        await saveAuthAccessToken(data?.authToken?.token);

        queryClient.invalidateQueries({ queryKey: ["me"] });
      } else if (data?.ok && !data?.user) {
        // if user is not verified, we need to navigate the user to userDetails screen
        router.push("/userDetails");
      }
    }

    if (response?.type === "success") {
      setToken(response?.authentication?.accessToken as string);
      handleLogin();
    }
  }, [response]);

  return (
    <TouchableOpacity
      disabled={mutation.isLoading}
      onPress={() => {
        promptAsync();
      }}
    >
      <Text>Sign in with google</Text>
    </TouchableOpacity>
  );
}

export default GoogleLogin;
