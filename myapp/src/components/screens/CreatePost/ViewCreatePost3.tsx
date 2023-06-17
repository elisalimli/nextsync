import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { ActivityIndicator, SafeAreaView, View } from "react-native";
import { Tag_FragmentFragment } from "../../../gql/graphql";
import CreatePostFooter from "./CreatePostFooter";
import CreatePostHeader from "./CreatePostHeader";
import CreatePost3Catalogs from "./CreatePost3Catalogs";

interface ViewCreatePost3Props {
  isLoading: boolean;
  catalogTags: Record<string, Tag_FragmentFragment[]>;
  tagIds: string[];
  handleSubmit: () => void;
}

const ViewCreatePost3 = ({
  catalogTags,
  handleSubmit,
  isLoading,
  tagIds,
}: ViewCreatePost3Props) => {
  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="dark" />
      <View className="flex-1">
        {isLoading ? (
          <View className="flex justify-center items-center">
            <ActivityIndicator size={"large"} />
          </View>
        ) : (
          <>
            <CreatePostHeader />
            <View className="flex-1 p-4">
              <CreatePost3Catalogs catalogTags={catalogTags} tagIds={tagIds} />
            </View>
            <CreatePostFooter handlePressNext={() => handleSubmit()} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ViewCreatePost3;
