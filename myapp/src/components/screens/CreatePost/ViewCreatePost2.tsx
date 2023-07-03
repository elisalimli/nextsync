import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  FileUpload,
  IDoc,
  useCreatePostStore,
} from "../../../stores/createPostStore";
import CustomSafeAreaView from "../../CustomSafeAreaView";
import CreatePostFileCard from "./CreatePostDocs";
import CreatePostFooter from "./CreatePostFooter";
import CreatePostHeader from "./CreatePostHeader";
import CreatePostDocs from "./CreatePostDocs";

export interface ViewCreatePost2Props {
  docs: IDoc[];
  pickDocument: any;
}

const ViewCreatePost2 = ({ docs, pickDocument }: ViewCreatePost2Props) => {
  const router = useRouter();
  const { setDocs } = useCreatePostStore();

  return (
    <CustomSafeAreaView>
      <StatusBar style="dark" />
      <CreatePostHeader />
      <CreatePostDocs pickDocument={pickDocument} docs={docs} />
      <CreatePostFooter
        handlePressNext={() => {
          router.push("/post/create-post-3");
          if (docs) setDocs(docs);
        }}
      />
    </CustomSafeAreaView>
  );
};

export default ViewCreatePost2;
