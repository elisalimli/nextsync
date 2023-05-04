import { useMutation } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import Input from "../../components/Form/Input";
import { setErrors } from "../../components/Form/setErrors";
import { useAuth } from "../../context/auth";
import { saveAuthAccessToken } from "../../src/auth/auth";
import { useFragment } from "../../src/gql";
import {
  FieldError,
  GoogleLoginOrSignUpInput,
  SendOtpInput,
} from "../../src/gql/graphql";
import { googleLoginOrSignUpMutationDocument } from "../../src/graphql/mutation/user/googleLoginOrSignup";
import { sendOtpMutation } from "../../src/graphql/mutation/user/sendOtp";
import { User_Fragment } from "../../src/graphql/query/user/me";
import { sendOtp } from "../../components/screens/Login/sendOtp";

const LoginStep2 = () => {
  const { token } = useAuth();
  const [googleLoginOrSignUpMutate] = useMutation(
    googleLoginOrSignUpMutationDocument
  );
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<GoogleLoginOrSignUpInput & FieldValues>();

  const onSubmit = async (data: GoogleLoginOrSignUpInput & FieldValues) => {
    const res = await googleLoginOrSignUpMutate({
      variables: {
        input: { ...data, token: token as string },
      },
    });
    if (res?.data?.googleLoginOrSignUp?.errors) {
      setErrors<SendOtpInput>(
        res!.data!.googleLoginOrSignUp!.errors as FieldError[],
        setError
      );
    }
    const user = useFragment(
      User_Fragment,
      res?.data?.googleLoginOrSignUp?.user
    );
    if (user?.phoneNumber) sendOtp(user.phoneNumber);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>You need to sign in</Text>
      <Input
        placeholder="Enter your username"
        name={"username"}
        control={control}
      />
      <Input
        placeholder="Enter your phone number"
        name={"phoneNumber"}
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
export default LoginStep2;
