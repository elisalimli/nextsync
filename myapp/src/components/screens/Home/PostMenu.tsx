import { Feather } from "@expo/vector-icons";
import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import ContextMenu from "react-native-context-menu-view";
import RNFetchBlob from "rn-fetch-blob";
import { constants } from "../../../constants";
import RNFS, { DownloadProgressCallbackResult, stat } from "react-native-fs";
import { useFile } from "./PostContext";
import { File_FragmentFragment, PostFile } from "../../../gql/graphql";
import { File_Fragment } from "../../../graphql/query/post/posts";
import { FragmentType, useFragment } from "../../../gql";
import { downloadFile } from "./downloadFile";
import { saveFile } from "./saveFile";

interface PostMenuProps {
  files: FragmentType<typeof File_Fragment>[];
}

const PostMenu = ({ files }: PostMenuProps) => {
  const {
    setTitle,
    setModalVisible,
    setProgress,
    setIsDownloaded,
    modalVisible,
  } = useFile();

  const handleSaveFiles = () => {
    setModalVisible(true);
    files.map(async (f, i) => {
      const file = useFragment(File_Fragment, f);
      const fileName = file?.url.split("/").pop() as string;
      const [sourceFilePath, destinationFilePath] = await downloadFile(
        fileName,
        file?.url,
        setTitle,
        setProgress
      );
      setTitle("saving files");
      await saveFile(
        sourceFilePath,
        destinationFilePath,
        i == files?.length - 1,
        setProgress,
        setIsDownloaded,
        setModalVisible
      );
    });
  };

  return (
    <ContextMenu
      dropdownMenuMode
      actions={[{ title: "Save to Downloads" }]}
      onPress={(e) => {
        if (e.nativeEvent.index === 0) handleSaveFiles();
      }}
    >
      <TouchableOpacity>
        <Feather name="bookmark" size={24} color="black" />
      </TouchableOpacity>
    </ContextMenu>
  );
};

export default PostMenu;
