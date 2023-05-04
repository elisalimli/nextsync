import { useMutation } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { saveAuthAccessToken } from "../../../src/auth/auth";
import { FieldError, LoginInput } from "../../../src/gql/graphql";
import { loginMutationDocument } from "../../../src/graphql/mutation/user/login";
import Input from "../../Form/Input";
import { setErrors } from "../../Form/setErrors";
import GoogleLogin from "./GoogleLogin";
import { updateMeCache } from "../../../src/graphql/updateMeCache";

const Login = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput & FieldValues>();

  const [loginMutate, { loading }] = useMutation(loginMutationDocument, {
    update(cache, { data }) {
      updateMeCache(cache, data?.login?.user);
    },
  });

  const onSubmit = async (data: LoginInput & FieldValues) => {
    const response = await loginMutate({ variables: { input: data } });
    // setting errors
    if (response?.data?.login?.errors) {
      setErrors<LoginInput>(
        response!.data!.login!.errors as FieldError[],
        setError
      );
    }

    // if response is ok, saving accessToken
    if (response.data?.login.ok && response.data?.login?.authToken) {
      await saveAuthAccessToken(response?.data?.login?.authToken?.token);
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
      <TouchableOpacity disabled={loading} onPress={handleSubmit(onSubmit)}>
        <Text>Submit</Text>
      </TouchableOpacity>
      <GoogleLogin />
    </SafeAreaView>
  );
};
export default Login;
