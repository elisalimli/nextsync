import clsx from "clsx";
import * as React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import {
  Catalog_FragmentFragment,
  Tag_FragmentFragment,
} from "../../../gql/graphql";
import { useCreatePostStore } from "../../../stores/createPostStore";

interface CreatePost3TagProps {
  isTagSelected: boolean;
  isActive: boolean;

  catalog: Catalog_FragmentFragment;
  tag: Tag_FragmentFragment;
}

const CreatePost3Tag = ({
  catalog,
  tag,
  isActive,
  isTagSelected,
}: CreatePost3TagProps) => {
  const { addTag } = useCreatePostStore();

  return (
    <TouchableOpacity
      onPress={() => addTag(tag?.id)}
      disabled={isTagSelected && !isActive}
      key={`post-tags-${tag?.id}-${catalog?.id}`}
      className={clsx(
        "bg-primary text-xs font-medium mr-2 px-4 py-2 rounded-full",
        isActive && "bg-secondary",
        isTagSelected && !isActive && "opacity-50"
      )}
    >
      <Text className="text-white font-semibold">{tag?.name}</Text>
    </TouchableOpacity>
  );
};

export default CreatePost3Tag;

const styles = StyleSheet.create({
  container: {},
});
