import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { getAuthAccessToken } from "../../../auth/auth";
import { queryClient } from "../../../graphql/client";
import { deletePostMutationDocument } from "../../../graphql/mutation/post/deletePost";
import { graphqlRequestClient } from "../../../graphql/requestClient";
import { useModal } from "../../contexts/ModalContext";
import { usePost } from "../../contexts/PostContext";
import { useDeletePostStore } from "../../../stores/deletePostStore";

interface PostModalProps {}

const PostModal = (props: PostModalProps) => {
  const { modalVisible, setModalVisible } = useModal();
  const { postIdToDelete } = useDeletePostStore();

  const mutation = useMutation(
    (postId: string) => {
      console.log("sending post", postId, postIdToDelete);
      return graphqlRequestClient.request(deletePostMutationDocument, {
        input: { id: postId },
      });
    },
    {
      onSuccess: async (data) => {
        console.log("delete post", data.deletePost);
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        closeModal();
      },
    }
  );

  const closeModal = () => {
    setModalVisible({ ...modalVisible, delete: false });
  };
  const handleCancel = () => closeModal();

  const handleDelete = () => mutation.mutate(postIdToDelete);
  return (
    <Modal isVisible={modalVisible?.delete}>
      <View className="flex-1 justify-center">
        <View className="bg-white/90 px-4 py-6 rounded-lg">
          <Text className="text-black text-2xl font-bold">Delete Post?</Text>
          <Text className="text-black font-medium mt-2">
            This can't be undone and it will be removed from your profile, and
            from Nextsync search results.
          </Text>
          <View className="flex-row justify-end mt-8">
            <TouchableOpacity onPress={handleCancel} className="mr-3">
              <Text className="text-lg font-semibold text-gray">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Text className="text-lg text-red-500 font-semibold">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PostModal;
