import * as React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { useFragment } from "../../../gql";
import { Post_FragmentFragment } from "../../../gql/graphql";
import {
  Catalog_Fragment,
  Tag_Fragment,
} from "../../../graphql/query/post/posts";

type PostTagsProps = Post_FragmentFragment;

const PostTags = ({ tags }: PostTagsProps) => {
  // console.log(tags);
  return (
    <ScrollView horizontal className="flex-row">
      {tags.map((t) => {
        const tag = useFragment(Tag_Fragment, t);
        const catalog = useFragment(Catalog_Fragment, tag.catalog);
        return (
          tag.id && (
            <TouchableOpacity
              key={`post-tags-${tag?.id}-${catalog?.id}`}
              className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
            >
              <Text>
                {catalog?.name && `${catalog?.name} : `} {tag?.name}
              </Text>
            </TouchableOpacity>
          )
        );
      })}
      {/* <TouchableOpacity className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
        <Text>Yellow</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
        <Text>Purple</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
};

export default PostTags;
