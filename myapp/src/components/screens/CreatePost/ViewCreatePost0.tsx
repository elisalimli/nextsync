import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, SafeAreaView, View } from "react-native";
import { PostTypeData } from "./ConnectedCreatePost0";
import CreatePostHeader from "./CreatePostHeader";
import CreatePostTypeCard from "./CreatePostTypeCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomSafeAreaView from "../../CustomSafeAreaView";

interface ViewCreatePost0Props {
  postTypesData: PostTypeData[];
  newsTagId: string;
}

const ViewCreatePost0 = ({
  postTypesData,
  newsTagId,
}: ViewCreatePost0Props) => {
  const insets = useSafeAreaInsets();
  console.log(insets);
  return (
    <CustomSafeAreaView>
      <StatusBar style="dark" />
      <View className="flex-1 mx-4">
        <CreatePostHeader />
        <View className="w-0 h-3 bg-red-500"></View>
        <View className="flex-1 mt-24">
          {postTypesData.map((data, i) => (
            <CreatePostTypeCard
              key={`create-post-type-card-${i}`}
              {...data}
              newsTagId={newsTagId}
            />
          ))}
        </View>
      </View>
    </CustomSafeAreaView>
  );
};

export default ViewCreatePost0;
