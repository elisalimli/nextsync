import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Post_FragmentFragment } from "../../../gql/graphql";

type PostHeaderProps = Post_FragmentFragment;

const PostHeader: React.FC<PostHeaderProps> = ({ title, description }) => {
  return (
    <View>
      <Text className="font-semibold text-base uppercase">{title}</Text>
      <Text className="font-normal text-sm">{description}</Text>
    </View>
  );
};

export default PostHeader;

const styles = StyleSheet.create({
  container: {},
});
