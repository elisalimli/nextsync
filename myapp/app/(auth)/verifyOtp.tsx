import { useMutation } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "expo-router";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import Input from "../../components/Form/Input";
import { setErrors } from "../../components/Form/setErrors";
import { FieldError, VerifyOtpInput } from "../../src/gql/graphql";
import { verifyOtpMutation } from "../../src/graphql/mutation/user/verifyOtp";
import { saveAuthAccessToken } from "../../src/auth/auth";
import { useAuth } from "../../context/auth";
import { updateMeCache } from "../../src/graphql/updateMeCache";

const SignIn = () => {
  const { phoneNumber } = useAuth();
  const [verifyOtpMutate, { data }] = useMutation(verifyOtpMutation, {
    update(cache, { data }) {
      updateMeCache(cache, data?.verifyOtp?.user);
    },
  });
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<VerifyOtpInput & FieldValues>();

  const onSubmit = async (data: VerifyOtpInput & FieldValues) => {
    const response = await verifyOtpMutate({
      variables: { input: { code: data.code, to: phoneNumber } },
    });
    if (response?.data?.verifyOtp?.errors) {
      setErrors<VerifyOtpInput>(
        response!.data!.verifyOtp!.errors as FieldError[],
        setError
      );
    }
    console.log("verify otp response", response);
    // if response is ok, saving accessToken
    if (response.data?.verifyOtp.ok && response?.data?.verifyOtp?.authToken) {
      await saveAuthAccessToken(response?.data?.verifyOtp?.authToken?.token);
      router.replace("/");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>You need to sign in</Text>
      <Input
        placeholder="Enter your otp code"
        name={"code"}
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
export default SignIn;
