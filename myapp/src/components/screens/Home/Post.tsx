import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LanguageType, Post_FragmentFragment } from "../../../gql/graphql";
import { FragmentType, useFragment } from "../../../gql";
import { Post_Fragment } from "../../../graphql/query/post/posts";
import { User_Fragment } from "../../../graphql/query/user/me";
import { Feather } from "@expo/vector-icons";

const typeNames = {
  Buraxilis: "Buraxılış",
  "1": "BLOK 1-ci qrup",
  "2": "BLOK 2-ci qrup",
  "3": "BLOK 3-cü qrup",
  "4": "BLOK 4-cü qrup",
};

const Post = (props: FragmentType<typeof Post_Fragment>) => {
  const { variant, language, type, title, description, creator } = useFragment(
    Post_Fragment,
    props
  );
  const user = useFragment(User_Fragment, creator);

  return (
    <View className=" px-4 py-6 rounded-lg">
      <View className="flex-row justify-between mb-2">
        <Text className="font-medium">@{user?.username}</Text>
        <TouchableOpacity>
          <Feather name="bookmark" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View>
        <Text className="font-semibold text-base uppercase">{title}</Text>
        <Text className="font-normal text-sm">{description}</Text>
      </View>

      <ScrollView horizontal className="flex-row">
        <View className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          <Text>Variant: {variant}</Text>
        </View>
        <View className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          <Text>{type}</Text>
        </View>
        <View className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          <Text>{LanguageType[language]}</Text>
        </View>
        <View className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          <Text>Yellow</Text>
        </View>
        <View className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          <Text>Indigo</Text>
        </View>
        <View className="bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          <Text>Purple</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Post;
