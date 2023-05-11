import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { LanguageType, Post_FragmentFragment } from "../../../gql/graphql";
import { FragmentType, useFragment } from "../../../gql";
import { Post_Fragment } from "../../../graphql/query/post/posts";
import { User_Fragment } from "../../../graphql/query/user/me";
import { Feather } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { isAvailableAsync, shareAsync } from "expo-sharing";
import RNFetchBlob from "rn-fetch-blob";

const Post = (props: FragmentType<typeof Post_Fragment>) => {
  const { id, variant, language, type, title, description, creator, files } =
    useFragment(Post_Fragment, props);
  const user = useFragment(User_Fragment, creator);

  const downloadFromUrl = async (url: string) => {
    const filename = url.split("/").pop() as string;
    // console.log("file url", FileSystem.documentDirectory + filename);

    const file = await FileSystem.getInfoAsync(
      FileSystem.documentDirectory + filename
    );
    let fileUrl = file?.uri;
    if (!file?.exists) {
      const result = await FileSystem.downloadAsync(
        url,
        FileSystem.documentDirectory + filename
      );
      fileUrl = result?.uri;
      // console.log(result);
    }
    RNFetchBlob.ios.openDocument(fileUrl);

    // save(result.uri, filename, result.headers["Content-Type"]);r
  };

  const save = async (uri: string, filename: string, mimetype: string) => {
    if (Platform.OS === "android") {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          filename,
          mimetype
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
          })
          .catch((e) => console.log(e));
      } else {
        shareAsync(uri);
      }
    } else {
      shareAsync(uri);
    }
  };

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

      <View>
        {files?.map((file) => {
          return (
            <TouchableOpacity
              key={`post-files-${id}-${file?.id}`}
              // onPress={shareAsync}
              onPress={() => downloadFromUrl(file?.url)}
              // onPress={() =>
              // OpenAnything.Pdf(
              // "file:///Users/alisalimli/Library/Developer/CoreSimulator/Devices/F8A7DC99-769E-4D9C-B8DB-71AC1A350034/data/Containers/Data/Application/D5B7B9B4-96CD-4E16-954C-2B1E06933E52/Documents/4972e9fd-e894-4714-abac-088f1887f277-dcefa407-32b4-47d6-93a3-57a911862110-The.Go.Programming.Language.pdf"
              // "file:///data/user/0/host.exp.exponent/files/ExperienceData/%2540quantum17%252Fapp/4972e9fd-e894-4714-abac-088f1887f277-dcefa407-32b4-47d6-93a3-57a911862110-The.Go.Programming.Language.pdf"
              // )
              // }
            >
              <Text>{file?.fileSize}</Text>
            </TouchableOpacity>
          );
        })}
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
