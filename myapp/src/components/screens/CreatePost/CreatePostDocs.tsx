import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  FileUpload,
  IDoc,
  useCreatePostStore,
} from "../../../stores/createPostStore";
import { ViewCreatePost2Props } from "./ViewCreatePost2";
import CreatePostDoc from "./CreatePostDoc/CreatePostDoc";
import Animated, {
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import {
  DragSortableView,
  AutoDragSortableView,
  AnySizeDragSortableView,
} from "react-native-drag-sort";

import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { truncateFileName } from "../Home/TruncatedFileName";
import { Ionicons } from "@expo/vector-icons";

interface ICreatePostDocsProps extends ViewCreatePost2Props {}

export default function CreatePostDocs({
  docs,
  pickDocument,
}: ICreatePostDocsProps) {
  const { setDocs } = useCreatePostStore();

  const deleteItem = (docToDelete: FileUpload) => {
    const newDocs = [...docs];
    const prevIndex = docs.findIndex(
      (item) => item.doc.uri === docToDelete.uri
    );
    newDocs.splice(prevIndex, 1);
    setDocs(newDocs);
  };

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
