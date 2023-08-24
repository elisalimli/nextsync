import { useRouter } from "expo-router";
import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { constants } from "../../../constants";
import { useCreatePostStore } from "../../../stores/createPostStore";
import { PostTypeData } from "./ConnectedCreatePost0";
import { useNavigation } from "expo-router";

type CreatePostTypeCardProps = PostTypeData & { newsTagId: string };

const CreatePostTypeCard = ({
  description,
  icon,
  title,
  type,
  newsTagId,
}: CreatePostTypeCardProps) => {
  const router = useRouter();
  const { addTag } = useCreatePostStore();

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        if (type === constants.NEWS_TAG_CODE) addTag(newsTagId);

        router.push({
          pathname: "/post/create-post-1",
        });
      }}
      className="mb-8 p-4 border border-gray rounded-lg flex-row"
    >
      <View className="mr-4 justify-center items-center">{icon}</View>
      <View className="mr-4">
        <Text className="text-2xl">{title}</Text>
        <Text className="text-darkGray mr-4">{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CreatePostTypeCard;
