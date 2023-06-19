import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { ActivityIndicator, Platform, SafeAreaView, View } from "react-native";
import { Tag_FragmentFragment } from "../../../gql/graphql";
import CreatePostFooter from "./CreatePostFooter";
import CreatePostHeader from "./CreatePostHeader";
import CreatePost3Catalogs from "./CreatePost3Catalogs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomSafeAreaView from "../../CustomSafeAreaView";

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
  const insets = useSafeAreaInsets();

  return (
    <CustomSafeAreaView>
      <StatusBar style="dark" />
      <View className="flex-1 mx-4">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
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
    </CustomSafeAreaView>
  );
};

export default ViewCreatePost3;
