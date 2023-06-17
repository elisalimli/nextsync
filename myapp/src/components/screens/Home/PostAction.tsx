import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  File_FragmentFragment,
  Post_FragmentFragment,
  User_FragmentFragment,
} from "../../../gql/graphql";
import { PostContext } from "./PostContext";
import PostMenu from "./PostMenu";
import { useFragment } from "../../../gql";
import { User_Fragment } from "../../../graphql/query/user/me";
import PostModal from "./PostModal";
import { File_Fragment } from "../../../graphql/query/post/posts";

type PostActionProps = Post_FragmentFragment;

const PostAction: React.FC<PostActionProps> = ({ files, creator }) => {
  const user = useFragment(User_Fragment, creator);

  return (
    <View className="flex-row justify-between mb-2">
      <Text className="font-medium">@{user?.username}</Text>

      <PostModal />
      <PostMenu files={files} />
    </View>
  );
};

export default PostAction;
