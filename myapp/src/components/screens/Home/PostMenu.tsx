import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import ContextMenu from "react-native-context-menu-view";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { constants } from "../../../constants";
import { useFragment } from "../../../gql";
import { File_Fragment } from "../../../graphql/query/post/posts";
import { useFile } from "./PostContext";
import { downloadFile } from "./downloadFile";
import { saveFile } from "./saveFile";

const titles = {
  saving: "Saving Files",
  downloading: "Downloading Files",
};

interface PostMenuProps {
  files: any;
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
    files.map(async (f: any, i: number) => {
      const file = useFragment(File_Fragment, f);
      const fileName = file?.url.split("/").pop() as string;
      setTitle(titles.downloading);

      const sourceFilePath = await downloadFile(
        fileName,
        file?.url,
        setTitle,
        setProgress
      );

      const fileNameSlices = file?.fileName.split(".");
      const fileExt = fileNameSlices[fileNameSlices?.length - 1];

      const newFileName = `${fileNameSlices[0]}-${uuidv4()}.${fileExt}`;
      const destinationFilePath = `${constants.folderPath}/${newFileName}`;
      setTitle(titles.saving);

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
        <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
      </TouchableOpacity>
    </ContextMenu>
  );
};

export default PostMenu;
