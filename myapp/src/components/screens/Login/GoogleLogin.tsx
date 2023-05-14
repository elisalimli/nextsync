import {
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
  GOOGLE_ANDROID_CLIENT_ID,
} from "@env";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { useAuth } from "../../../../context/auth";
import { saveAuthAccessToken } from "../../../auth/auth";
import { googleLoginOrSignUpMutationDocument } from "../../../graphql/mutation/user/googleLoginOrSignup";

import { useMutation } from "@apollo/client";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { updateMeCache } from "../../../graphql/updateMeCache";
import { Text } from "../../Themed";
import { useFragment } from "../../../gql";
import { User_Fragment } from "../../../graphql/query/user/me";
import { useSendOtp } from "./sendOtp";
import { sendOtpMutation } from "../../../graphql/mutation/user/sendOtp";

WebBrowser.maybeCompleteAuthSession();

function GoogleLogin() {
  const router = useRouter();
  const { token, setPhoneNumber } = useAuth();

  const { setToken } = useAuth();
  const [googleLoginOrSignUpMutate, { loading }] = useMutation(
    googleLoginOrSignUpMutationDocument,
    {
      update(cache, { data }) {
        console.log("updating cache", data?.googleLoginOrSignUp?.user);
        updateMeCache(cache, data?.googleLoginOrSignUp?.user);
      },
    }
  );
  const [_, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
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
      console.log("toekn", res?.data?.googleLoginOrSignUp, token);
      const data = res?.data?.googleLoginOrSignUp;
      const user = useFragment(
        User_Fragment,
        res?.data?.googleLoginOrSignUp?.user
      );
      console.log("google login data", data, user);
      // if response is ok, saving accessToken
      if (data?.ok && data?.authToken) {
        await saveAuthAccessToken(data?.authToken?.token);
      } else if (data?.ok && !data?.user) {
        // if user is not verified, we need to navigate the user to userDetails screen
        router.push("/userDetails");
      }
      // else if (data?.ok && user && !user?.verified) {
      //   const response = await sendOtpMutate({
      //     variables: {
      //       input: { to: user?.phoneNumber },
      //     },
      //   });

      //   if (response?.data?.sendOtp?.ok) {
      //     setPhoneNumber(user?.phoneNumber);
      //     router.push("/verifyOtp");
      //   }
      // }
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
