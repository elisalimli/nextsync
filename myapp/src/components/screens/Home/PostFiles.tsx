import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Post_FragmentFragment } from "../../../gql/graphql";
import File from "./File";
import { useFile } from "./PostContext";
import { useFragment } from "../../../gql";
import { File_Fragment } from "../../../graphql/query/post/posts";

type PostFilesProps = Post_FragmentFragment;

const PostFiles = ({ files, id }: PostFilesProps) => {
  return (
    <View className="mt-2 mb-4">
      {files?.map((_file) => {
        const file = useFragment(File_Fragment, _file);
        if (file)
          return <File key={`post-files-${id}-${file?.id}`} file={file} />;
      })}
    </View>
  );
};

export default PostFiles;
