import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../../../context/auth";
import { saveAuthAccessToken } from "../../../auth/auth";
import { FieldError } from "../../../gql/graphql";
import { googleSignUpMutationDocument } from "../../../graphql/mutation/user/googleSignup";
import { graphqlRequestClient } from "../../../graphql/requestClient";
import CustomSafeAreaView from "../../CustomSafeAreaView";
import { TextInput } from "../../Form/TextInput";
import { setErrors } from "../../Form/setErrors";
import { Feather } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export interface GoogleSignUpFormValues {
  username: string;
  phoneNumber: string;
}

const GoogleSignUp = () => {
  const router = useRouter();
  const [_, setError] = React.useState<Boolean>(false);
  const methods = useForm<GoogleSignUpFormValues>({
    mode: "onChange",
    values: {
      username: "",
      phoneNumber: "",
    },
  });

  const mutation = useMutation(async () => {
    const isSignedIn = await GoogleSignin.getTokens();
    return graphqlRequestClient.request(googleSignUpMutationDocument, {
      input: {
        token: isSignedIn.accessToken,
        username: methods.getValues().username,
        phoneNumber: methods.getValues().phoneNumber,
      },
    });
  }, {});

  const onSubmit = async () => {
    const res = await mutation.mutateAsync();
    const resData = res?.googleSignUp;
    console.log(resData, methods.getValues());
    if (resData?.errors) {
      setErrors<GoogleSignUpFormValues>(
        resData?.errors as FieldError[],
        methods.setError
      );
    } else if (resData?.ok && resData?.authToken) {
      await saveAuthAccessToken(resData?.authToken?.token);
      router.replace("/");
    }
  };

  return (
    <CustomSafeAreaView>
      <View className="flex-1 px-9 mt-24">
        <View className="flex-1">
          <Text className="text-2xl font-semibold">Qeydiyyatdan keçin.</Text>
          <Text className="mt-2 text-darkGray">Uğurlar! </Text>
        </View>
        <FormProvider {...methods}>
          <View className="flex-1">
            <TextInput
              icon={<Feather name="user" size={20} color="black" />}
              label="İstifadəçi adı"
              containerProps={{ className: "mb-4" }}
              inputContainerProps={{
                className: "border-b-2 border-b-darkGray/20 pb-1",
              }}
              className="text-xl"
              name="username"
              placeholder="İstifadəçi adınzı daxil edin..."
              keyboardType="default"
              setFormError={setError}
            />

            <TextInput
              label="Telefon nömrəsi"
              name="phoneNumber"
              icon={<Feather name="phone" size={20} color="black" />}
              inputContainerProps={{
                className: "border-b-2 border-b-darkGray/20 pb-1",
              }}
              className="text-xl"
              placeholder="Telefon nömrənizi daxil edin..."
              keyboardType="number-pad"
              setFormError={setError}
            />
          </View>
          <View className="flex-1">
            <TouchableOpacity onPress={onSubmit}>
              <Text>Gonder</Text>
            </TouchableOpacity>
          </View>
        </FormProvider>
      </View>
    </CustomSafeAreaView>
  );
};

export default GoogleSignUp;
