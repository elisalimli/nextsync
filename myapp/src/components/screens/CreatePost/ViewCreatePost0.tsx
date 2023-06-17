import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { SafeAreaView, View } from "react-native";
import { PostTypeData } from "./ConnectedCreatePost0";
import CreatePostHeader from "./CreatePostHeader";
import CreatePostTypeCard from "./CreatePostTypeCard";

interface ViewCreatePost0Props {
  postTypesData: PostTypeData[];
  newsTagId: string;
}

const ViewCreatePost0 = ({
  postTypesData,
  newsTagId,
}: ViewCreatePost0Props) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <View className="mx-8 flex-1">
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
    </SafeAreaView>
  );
};

export default ViewCreatePost0;
