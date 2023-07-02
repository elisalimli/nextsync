import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { IDoc } from "../../../stores/createPostStore";
import { truncateFileName } from "../Home/TruncatedFileName";

type ICreatePostDocProps = RenderItemParams<IDoc>;

const CreatePostDoc = ({ item, drag, isActive }: ICreatePostDocProps) => {
  const { name } = item.doc;
  return (
    <ScaleDecorator>
      <TouchableOpacity onLongPress={drag} disabled={isActive}>
        <View className="flex-row items-center ml-4">
          <Ionicons name="reorder-two-outline" size={28} color="#8F92A1" />
          <Text className="text-darkGray text-lg lowercase">
            {truncateFileName(name)}
          </Text>
        </View>
        <View className="w-full h-[1px] bg-gray/20 my-4"></View>
      </TouchableOpacity>
    </ScaleDecorator>
  );
};

export default CreatePostDoc;
