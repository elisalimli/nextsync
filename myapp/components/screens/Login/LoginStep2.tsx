import { useMutation } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import React from "react";
import { useForm, FieldValues } from "react-hook-form";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../../context/auth";
import { useFragment } from "../../../src/gql";
import {
  FieldError,
  GoogleLoginOrSignUpInput,
  SendOtpInput,
} from "../../../src/gql/graphql";
import { googleLoginOrSignUpMutationDocument } from "../../../src/graphql/mutation/user/googleLoginOrSignup";
import { User_Fragment } from "../../../src/graphql/query/user/me";
import Input from "../../Form/Input";
import { setErrors } from "../../Form/setErrors";
import { sendOtp } from "./sendOtp";

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
