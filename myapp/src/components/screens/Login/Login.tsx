import { ErrorMessage } from "@hookform/error-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { saveAuthAccessToken } from "../../../auth/auth";
import { FieldError, LoginInput } from "../../../gql/graphql";
import { loginMutationDocument } from "../../../graphql/mutation/user/login";
import Input from "../../Form/Input";
import { setErrors } from "../../Form/setErrors";
import GoogleLogin from "./GoogleLogin";
import { graphqlRequestClient } from "../../../graphql/requestClient";

const Login = () => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<LoginInput & FieldValues>();

  const mutation = useMutation(
    () =>
      graphqlRequestClient.request(loginMutationDocument, {
        input: {
          email: getValues().email,
          password: getValues().password,
        },
      }),
    {
      onSuccess: async (data) => {
        // Invalidate and refetch
        if (data?.login?.ok && data?.login?.authToken) {
          await saveAuthAccessToken(data?.login?.authToken?.token);
          await queryClient.resetQueries();
        }
      },
    }
  );

  const onSubmit = async (data: LoginInput & FieldValues) => {
    const response = await mutation.mutateAsync();
    // setting errors
    if (response?.login?.errors) {
      setErrors<LoginInput>(response!.login!.errors as FieldError[], setError);
    }

    // if response is ok, saving accessToken
    if (response.login.ok && response.login?.authToken) {
      await saveAuthAccessToken(response?.login?.authToken?.token);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>You need to sign in</Text>
      <Input
        placeholder="Enter your username or email"
        name={"email"}
        control={control}
      />
      <Input
        placeholder="Enter your password"
        name={"password"}
        control={control}
      />
      <ErrorMessage
        errors={errors}
        name={"root.serverError"}
        render={({ message }) => <Text>{message}</Text>}
      />
      <TouchableOpacity
        disabled={mutation.isLoading}
        onPress={handleSubmit(onSubmit)}
      >
        <Text>Submit</Text>
      </TouchableOpacity>
      <GoogleLogin />
    </SafeAreaView>
  );
};
export default Login;
