import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { Platform, SafeAreaView, View } from "react-native";
import { CreatePostFormValues } from "./ConnectedCreatePost1";
import CreatePost1Form from "./CreatePost1Form";
import CreatePostFooter from "./CreatePostFooter";
import CreatePostHeader from "./CreatePostHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomSafeAreaView from "../../CustomSafeAreaView";

interface ViewCreatePost1Props {
  methods: UseFormReturn<CreatePostFormValues, any>;
  setFormValues: (newFormValues: CreatePostFormValues) => void;
}

const ViewCreatePost1 = ({ methods, setFormValues }: ViewCreatePost1Props) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <CustomSafeAreaView>
      <StatusBar style="dark" />
      <View className="flex-1 mx-4">
        <CreatePostHeader />
        <CreatePost1Form methods={methods} />
        <CreatePostFooter
          handlePressNext={() => {
            router.push("/post/create-post-2");
            setFormValues(methods.getValues());
          }}
          nextButtonProps={{
            disabled: !methods.formState.isValid,
          }}
        />
      </View>
    </CustomSafeAreaView>
  );
};

export default ViewCreatePost1;
