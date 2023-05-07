import React from "react";
import { Text, View } from "react-native";
import { Post_FragmentFragment } from "../../../gql/graphql";
import { FragmentType, useFragment } from "../../../gql";
import { Post_Fragment } from "../../../graphql/query/post/posts";

const Post = (props: FragmentType<typeof Post_Fragment>) => {
  const { title } = useFragment(Post_Fragment, props);

  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};

export default Post;
