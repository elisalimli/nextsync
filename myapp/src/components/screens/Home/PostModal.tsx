import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import * as Progress from "react-native-progress";
import { useFile } from "./PostContext";

interface PostModalProps {}

const PostModal = (props: PostModalProps) => {
  const { modalVisible, progress, title } = useFile();
  return (
    <Modal isVisible={modalVisible}>
      <View className="flex-1 justify-center">
        <View className="bg-white/30 p-2">
          <Text className="text-white text-2xl font-bold">{title}</Text>
          <View className="w-full ">
            <Progress.Bar progress={progress} width={null} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PostModal;
