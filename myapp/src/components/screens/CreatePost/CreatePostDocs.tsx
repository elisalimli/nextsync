import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { IDoc, useCreatePostStore } from "../../../stores/createPostStore";
import CreatePostDoc from "./CreatePostDoc/CreatePostDoc";
import { ViewCreatePost2Props } from "./ViewCreatePost2";

import DraggableFlatList from "react-native-draggable-flatlist";

interface ICreatePostDocsProps extends ViewCreatePost2Props {}

export default function CreatePostDocs({
  docs,
  pickDocument,
}: ICreatePostDocsProps) {
  const { setDocs } = useCreatePostStore();

  return (
    <View className="flex-1 p-4">
      <TouchableOpacity className="mb-4" onPress={pickDocument}>
        <Text className="text-secondary text-lg">+ Yeni sənəd əlavə et</Text>
      </TouchableOpacity>

      <DraggableFlatList
        className="h-full"
        data={docs}
        onDragEnd={({ data }) => setDocs(data)}
        keyExtractor={(item: IDoc) => `${item.id}`}
        renderItem={(props) => <CreatePostDoc {...props} />}
      />
    </View>
  );
}
