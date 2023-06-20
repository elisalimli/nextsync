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
import { graphqlRequestClient } from "../../../graphql/requestClient";
import { saveAuthAccessToken } from "../../../auth/auth";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { googleLoginpMutationDocument } from "../../../graphql/mutation/user/googleLogin";

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
      return graphqlRequestClient.request(googleLoginpMutationDocument, {
        input: { token: isSignedIn.accessToken },
      });
    }, {});

    return (
      <View>
        <TouchableOpacity
          className="bg-black flex-row p-2 border rounded-full justify-center items-center"
          onPress={async () => {
            await signIn();
            const res = await mutation.mutateAsync();
            const data = res?.googleLogin;

            const isSignedIn = await GoogleSignin.getTokens();
            console.log("token", isSignedIn);

            // if response is ok, saving accessToken
            if (data?.ok && data?.authToken) {
              await saveAuthAccessToken(data?.authToken?.token);
              queryClient.invalidateQueries({ queryKey: ["me"] });
            } else if (data?.ok && !data?.user) {
              // if user is not verified, we need to navigate the user to googleSignUp screen
              router.push("/googleSignUp");
            }
          }}
        >
          <AntDesign name="google" size={24} color="white" />
          <Text className="text-white font-bold ml-4">LOGIN WITH GOOGLE</Text>
        </TouchableOpacity>
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
