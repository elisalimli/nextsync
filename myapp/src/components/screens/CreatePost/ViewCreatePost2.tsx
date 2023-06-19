import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, SafeAreaView, View } from "react-native";
import {
  FileUpload,
  useCreatePostStore,
} from "../../../stores/createPostStore";
import CreatePost2Cards from "./CreatePost2Cards";
import CreatePostFooter from "./CreatePostFooter";
import CreatePostHeader from "./CreatePostHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomSafeAreaView from "../../CustomSafeAreaView";

interface ViewCreatePost2Props {
  docs: FileUpload[];
  pickDocument: any;
}

const ViewCreatePost2 = ({ docs, pickDocument }: ViewCreatePost2Props) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setDocs } = useCreatePostStore();

  return (
    <CustomSafeAreaView>
      <StatusBar style="dark" />
      <View className="flex-1 mx-4">
        <CreatePostHeader />
        <View className="flex-1 p-2">
          <CreatePost2Cards pickDocument={pickDocument} docs={docs} />
        </View>
        <CreatePostFooter
          handlePressNext={() => {
            router.push("/post/create-post-3");
            if (docs) setDocs(docs);
          }}
        />
      </View>
    </CustomSafeAreaView>
  );
};

export default ViewCreatePost2;
