import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Post_FragmentFragment } from "../../../gql/graphql";

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

type PostTagsProps = Post_FragmentFragment;

const PostTags = ({ variant, type, language }: PostTagsProps) => {
  return (
    <ScrollView horizontal className="flex-row">
      {variant && (
        <TouchableOpacity className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          <Text>Variant: {variant}</Text>
        </TouchableOpacity>
      )}

      {Type[type] && (
        <TouchableOpacity className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          <Text>{Type[type]}</Text>
        </TouchableOpacity>
      )}

      {language && (
        <TouchableOpacity className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          <Text>Xarici dil / {Language[language]} dili</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
        <Text>Yellow</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
        <Text>Purple</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PostTags;
