import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  NativeModuleError,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import type { User } from "@react-native-google-signin/google-signin";
// @ts-ignore see docs/CONTRIBUTING.md for details
import config from "./config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { googleLoginOrSignUpMutationDocument } from "../../../graphql/mutation/user/googleLoginOrSignup";
import { graphqlRequestClient } from "../../../graphql/requestClient";
import { saveAuthAccessToken } from "../../../auth/auth";
import { useRouter } from "expo-router";

const GoogleSigninSampleApp = () => {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      androidClientId:
        "451487467771-0mi190vvagdsjfiahi020g3jh72net4u.apps.googleusercontent.com",
      iosClientId:
        "451487467771-4pcnru9mac9q7qv1e8hlhvfnbcablrtf.apps.googleusercontent.com",
      webClientId: config.webClientId,
      offlineAccess: false,
    });
  };

  const renderSignInButton = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const mutation = useMutation(async () => {
      const isSignedIn = await GoogleSignin.getTokens();
      return graphqlRequestClient.request(googleLoginOrSignUpMutationDocument, {
        input: { token: isSignedIn.accessToken },
      });
    }, {});

    return (
      <View>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Standard}
          color={GoogleSigninButton.Color.Dark}
          onPress={async () => {
            await signIn();
            const res = await mutation.mutateAsync();
            const data = res?.googleLoginOrSignUp;
            console.log("getting current user..", data);

            console.log("res", res);

            // if response is ok, saving accessToken
            if (data?.ok && data?.authToken) {
              await saveAuthAccessToken(data?.authToken?.token);
              queryClient.invalidateQueries({ queryKey: ["me"] });
            } else if (data?.ok && !data?.user) {
              // if user is not verified, we need to navigate the user to userDetails screen
              router.push("/userDetails");
            }
          }}
        />
      </View>
    );
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
    } catch (error) {
      const typedError = error as NativeModuleError;
      switch (typedError.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          // sign in was cancelled
          Alert.alert("Cancelled");
          break;
        case statusCodes.IN_PROGRESS:
          // operation (eg. sign in) already in progress
          Alert.alert("In progress");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // android only
          Alert.alert("Play services not available or outdated");
          break;
        default:
          Alert.alert("Something went wrong", typedError.toString());
      }
    }
  };

  const body = renderSignInButton();

  return (
    <SafeAreaView>
      <ScrollView>{body}</ScrollView>
    </SafeAreaView>
  );
};

export default GoogleSigninSampleApp;
