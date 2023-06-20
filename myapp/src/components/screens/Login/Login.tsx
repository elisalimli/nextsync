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
import CustomSafeAreaView from "../../CustomSafeAreaView";
import { View } from "react-native";

const Login = () => {
  return (
    <CustomSafeAreaView>
      <View className="flex-1 px-9 mt-24">
        <View className="flex-1">
          <Text className="text-2xl font-semibold">Qeydiyyatdan keçin.</Text>
          <Text className="mt-2 text-darkGray">
            İmtahanlar, sınaqlar və daha çoxu.
          </Text>
        </View>
        <View className="mb-4">
          <GoogleLogin />
        </View>
      </View>
    </CustomSafeAreaView>
  );
};
export default Login;
