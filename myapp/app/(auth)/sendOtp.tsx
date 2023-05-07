import { useMutation } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import React, { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import Input from "../../src/components/Form/Input";
import { setErrors } from "../../src/components/Form/setErrors";
import { saveAuthAccessToken } from "../../src/auth/auth";
import { FieldError, LoginInput, SendOtpInput } from "../../src/gql/graphql";
import { loginMutationDocument } from "../../src/graphql/mutation/user/login";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { googleLoginOrSignUpMutationDocument } from "../../src/graphql/mutation/user/googleLoginOrSignup";
import { sendOtpMutation } from "../../src/graphql/mutation/user/sendOtp";
import { useRouter } from "expo-router";

const SendOtp = () => {
  const [sendOtpMutate, { data }] = useMutation(sendOtpMutation);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SendOtpInput & FieldValues>();

  const onSubmit = async (data: SendOtpInput & FieldValues) => {
    const response = await sendOtpMutate({ variables: { input: data } });
    if (response?.data?.sendOtp?.errors) {
      setErrors<SendOtpInput>(
        response!.data!.sendOtp!.errors as FieldError[],
        setError
      );
    }

    console.log("send otp response");
    // if response is ok, saving accessToken
    if (response.data?.sendOtp.ok) {
      router.push("/verifyOtp");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>You need to sign in</Text>
      <Input
        placeholder="Enter your phone number"
        name={"to"}
        control={control}
      />
      <ErrorMessage
        errors={errors}
        name={"root.serverError"}
        render={({ message }) => <Text>{message}</Text>}
      />
      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default SendOtp;
