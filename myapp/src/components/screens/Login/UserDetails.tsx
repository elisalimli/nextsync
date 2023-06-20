import { ErrorMessage } from "@hookform/error-message";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../../../context/auth";
import { saveAuthAccessToken } from "../../../auth/auth";
import {
  FieldError,
  GoogleLoginOrSignUpInput,
  SendOtpInput,
} from "../../../gql/graphql";
import { googleLoginOrSignUpMutationDocument } from "../../../graphql/mutation/user/googleLoginOrSignup";
import Input from "../../Form/Input";
import { setErrors } from "../../Form/setErrors";
import { graphqlRequestClient } from "../../../graphql/requestClient";

const UserDetails = () => {
  const { token, setPhoneNumber } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    getValues,
  } = useForm<GoogleLoginOrSignUpInput & FieldValues>();

  const mutation = useMutation(
    () =>
      graphqlRequestClient.request(googleLoginOrSignUpMutationDocument, {
        input: {
          token,
          phoneNumber: getValues().phoneNumber,
          username: getValues().username,
        },
      }),
    {}
  );

  const onSubmit = async (data: GoogleLoginOrSignUpInput & FieldValues) => {
    const res = await mutation.mutateAsync();
    const resData = res?.googleLoginOrSignUp;
    if (resData?.errors) {
      setErrors<SendOtpInput>(resData?.errors as FieldError[], setError);
    } else if (resData?.ok && resData?.authToken) {
      await saveAuthAccessToken(resData?.authToken?.token);
      router.replace("/");
    }
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

export default UserDetails;
