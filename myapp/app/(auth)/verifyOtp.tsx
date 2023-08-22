import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "expo-router";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import Input from "../../src/components/Form/Input";
import { VerifyOtpInput } from "../../src/gql/graphql";

const SignIn = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpInput & FieldValues>();

  const onSubmit = async (data: VerifyOtpInput & FieldValues) => {
    // const response = await verifyOtpMutate({
    //   variables: { input: { code: data.code, to: phoneNumber } },
    // });
    // if (response?.data?.verifyOtp?.errors) {
    //   setErrors<VerifyOtpInput>(
    //     response!.data!.verifyOtp!.errors as FieldError[],
    //     setError
    //   );
    // }
    // // if response is ok, saving accessToken
    // if (response.data?.verifyOtp.ok && response?.data?.verifyOtp?.authToken) {
    //   await saveAuthAccessToken(response?.data?.verifyOtp?.authToken?.token);
    //   router.replace("/");
    // }
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
