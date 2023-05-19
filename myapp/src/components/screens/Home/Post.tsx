import React from "react";
import { View } from "react-native";
import { FragmentType, useFragment } from "../../../gql";
import { Post_Fragment } from "../../../graphql/query/post/posts";
import PostFiles from "./PostFiles";
import PostHeader from "./PostHeader";
import PostTags from "./PostTags";
import PostTop from "./PostTop";
import { PostContext } from "./PostContext";

const Post = (props: FragmentType<typeof Post_Fragment>) => {
  const post = useFragment(Post_Fragment, props);
  // Post Context variables
  const [modalVisible, setModalVisible] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [title, setTitle] = React.useState("Downloading files");
  const [isDownloaded, setIsDownloaded] = React.useState(false);

  return (
    <PostContext.Provider
      value={{
        isDownloaded,
        progress,
        title,
        modalVisible,
        setProgress,
        setIsDownloaded,
        setTitle,
        setModalVisible,
      }}
    >
      <View>
        <View className="px-4 py-6 bg-lightGray2">
          {/* TITLE & DESCRIPTION */}
          <PostTop {...post} />
          {/* TITLE & DESCRIPTION */}
          <PostHeader {...post} />
          {/* FILES */}
          <PostFiles {...post} />
          {/* TAGS */}
          <PostTags {...post} />
        </View>
        {/* divider */}
        <View className="h-[1px] w-full  bg-lightGray1"></View>
      </View>
    </PostContext.Provider>
  );
};

export default Post;
