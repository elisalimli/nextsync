import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Post_FragmentFragment } from "../../../gql/graphql";
import PostDescription from "./PostDescription";

type PostHeaderProps = Post_FragmentFragment;

const PostHeader: React.FC<PostHeaderProps> = ({
  title,
  description,
  htmlContent,
}) => {
  return (
    <View>
      <Text className="font-semibold text-base uppercase">{title}</Text>
      <PostDescription description={description} htmlContent={htmlContent} />
    </View>
  );
};

export default PostHeader;

const styles = StyleSheet.create({
  container: {},
});
