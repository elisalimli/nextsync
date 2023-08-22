import React from "react";
import { View } from "react-native";
import { FragmentType, useFragment } from "../../../gql";
import { Post_Fragment } from "../../../graphql/query/post/posts";
import { PostContext } from "../../contexts/PostContext";
import PostFiles from "./PostFiles";
import PostHeader from "./PostHeader";
import PostTags from "./PostTags";
import PostAction from "./PostAction";

const Post = (props: FragmentType<typeof Post_Fragment>) => {
  const post = useFragment(Post_Fragment, props);
  // Post Context variables
  const [progress, setProgress] = React.useState(0);
  const [title, setTitle] = React.useState("Downloading files");
  const [isDownloaded, setIsDownloaded] = React.useState(false);

  return (
    <PostContext.Provider
      value={{
        isDownloaded,
        progress,
        title,
        setProgress,
        setIsDownloaded,
        setTitle,
      }}
    >
      <View>
        <View className="px-4 py-6 bg-lightGray2">
          {/* TITLE & DESCRIPTION */}
          <PostAction {...post} />
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

export default React.memo(Post);
