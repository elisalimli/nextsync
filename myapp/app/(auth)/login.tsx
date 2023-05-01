import { useMutation } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import Input from "../../components/Form/Input";
import { setErrors } from "../../components/Form/setErrors";
import { saveAuthAccessToken } from "../../src/auth/auth";
import { FieldError, LoginInput } from "../../src/gql/graphql";
import { loginMutationDocument } from "../../src/graphql/mutation/user/login";

const SignIn = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput & FieldValues>();
  const [mutateFunction, { data, loading, error }] = useMutation(
    loginMutationDocument,
    {
      update(cache, { data }) {
        cache.modify({
          fields: {
            me() {
              return data?.login?.user;
            },
          },
        });
      },
    }
  );

  const onSubmit = async (data: LoginInput & FieldValues) => {
    const response = await mutateFunction({ variables: { input: data } });
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
      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default SignIn;
