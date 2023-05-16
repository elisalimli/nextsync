import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FragmentType, useFragment } from "../../../gql";
import { File_FragmentFragment } from "../../../gql/graphql";
import {
  File_Fragment,
  Post_Fragment,
} from "../../../graphql/query/post/posts";
import { User_Fragment } from "../../../graphql/query/user/me";
import File from "./File";

enum Language {
  AZE = "Azərbaycan",
  ENG = "İngilis",
  RU = "Rus",
}

enum Type {
  BLOK1 = "BLOK 1-ci qrup",
  BLOK2 = "BLOK 2-ci qrup",
  BLOK3 = "BLOK 3-cü qrup",
  BLOK4 = "BLOK 4-cü qrup",
  BURAXILIS = "Buraxılış",
}

const Post = (props: FragmentType<typeof Post_Fragment>) => {
  const { id, variant, language, type, title, description, creator, files } =
    useFragment(Post_Fragment, props);
  const user = useFragment(User_Fragment, creator);
  console.log("variant", type);
  return (
    <View className="px-4 py-6 rounded-lg">
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

      <View className="mb-4">
        {files?.map((_file) => {
          const file = useFragment(File_Fragment, _file);
          return <File key={`post-files-${id}-${file?.id}`} file={file} />;
        })}
      </View>

      <ScrollView horizontal className="flex-row">
        {variant && (
          <View className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
            <Text>Variant: {variant}</Text>
          </View>
        )}

        {Type[type] && (
          <View className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
            <Text>{Type[type]}</Text>
          </View>
        )}

        {language && (
          <TouchableOpacity className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
            <Text>Xarici dil / {Language[language]} dili</Text>
          </TouchableOpacity>
        )}

        <View className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          <Text>Yellow</Text>
        </View>

        <View className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          <Text>Purple</Text>
        </View>
        {/* 
        <View className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          <Text>Yellow</Text>
        </View>
        <View className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          <Text>Indigo</Text>
        </View> 
        <View className="bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          <Text>Purple</Text>
        </View> */}
      </ScrollView>
    </View>
  );
};

export default Post;
