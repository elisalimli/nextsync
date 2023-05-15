import { useMutation } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import React from "react";
import { useForm, FieldValues } from "react-hook-form";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../../../context/auth";
import { useFragment } from "../../../gql";
import {
  FieldError,
  GoogleLoginOrSignUpInput,
  SendOtpInput,
} from "../../../gql/graphql";
import { googleLoginOrSignUpMutationDocument } from "../../../graphql/mutation/user/googleLoginOrSignup";
import { User_Fragment } from "../../../graphql/query/user/me";
import Input from "../../Form/Input";
import { setErrors } from "../../Form/setErrors";
import { useSendOtp } from "./sendOtp";
import { useRouter } from "expo-router";
import { sendOtpMutation } from "../../../graphql/mutation/user/sendOtp";
import { updateMeCache } from "../../../graphql/updateMeCache";
import { saveAuthAccessToken } from "../../../auth/auth";

const UserDetails = () => {
  const { token, setPhoneNumber } = useAuth();
  const router = useRouter();

  const [sendOtpMutate] = useMutation(sendOtpMutation);

  const [googleLoginOrSignUpMutate] = useMutation(
    googleLoginOrSignUpMutationDocument,
    {
      update(cache, { data }) {
        updateMeCache(cache, data?.googleLoginOrSignUp?.user);
      },
    }
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
    const resData = res?.data?.googleLoginOrSignUp;
    if (resData?.errors) {
      setErrors<SendOtpInput>(
        res!.data!.googleLoginOrSignUp!.errors as FieldError[],
        setError
      );
    } else if (resData?.ok && resData?.authToken) {
      await saveAuthAccessToken(resData?.authToken?.token);
      router.replace("/");
    }
    // const user = useFragment(
    //   User_Fragment,
    //   res?.data?.googleLoginOrSignUp?.user
    // );
    // if (user?.phoneNumber) {
    // const response = await sendOtpMutate({
    // variables: {
    // input: { to: user?.phoneNumber },
    // },
    // });
    // console.log("send otp response", response, user?.phoneNumber);
    // if (response?.data?.sendOtp?.ok) {
    // setPhoneNumber(user?.phoneNumber);
    // router.push("/verifyOtp");
    // }
    // }
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
