import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from "@env";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { useAuth } from "../../../context/auth";
import { saveAuthAccessToken } from "../../../src/auth/auth";
import { googleLoginOrSignUpMutationDocument } from "../../../src/graphql/mutation/user/googleLoginOrSignup";

import { useMutation } from "@apollo/client";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { updateMeCache } from "../../../src/graphql/updateMeCache";
import { Text } from "../../Themed";

WebBrowser.maybeCompleteAuthSession();

function GoogleLogin() {
  const router = useRouter();
  const { setToken } = useAuth();
  const [googleLoginOrSignUpMutate, { loading }] = useMutation(
    googleLoginOrSignUpMutationDocument,
    {
      update(cache, { data }) {
        updateMeCache(cache, data?.googleLoginOrSignUp?.user);
      },
    }
  );
  const [_, response, promptAsync] = Google.useAuthRequest({
    // androidClientId: "GOOGLE_GUID.apps.googleusercontent.com",
    expoClientId: GOOGLE_IOS_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    async function handleLogin(token: string) {
      const res = await googleLoginOrSignUpMutate({
        variables: {
          input: { token },
        },
      });
      const data = res?.data?.googleLoginOrSignUp;
      // if response is ok, saving accessToken
      if (data?.ok && data?.authToken) {
        await saveAuthAccessToken(data?.authToken?.token);
      } else {
        // if user is not verified, we need to navigate the user to addMoreInfo screen
        router.push("/loginStep2");
      }
    }

    if (response?.type === "success") {
      setToken(response?.authentication?.accessToken as string);
      handleLogin(response?.authentication?.accessToken as string);
    }
  }, [response]);
  return (
    <TouchableOpacity
      disabled={loading}
      onPress={() => {
        promptAsync();
      }}
    >
      <Text>Sign in with google</Text>
    </TouchableOpacity>
  );
}

export default GoogleLogin;
