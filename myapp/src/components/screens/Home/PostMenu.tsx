import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import ContextMenu from "react-native-context-menu-view";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { constants } from "../../../constants";
import { useFragment } from "../../../gql";
import { File_Fragment } from "../../../graphql/query/post/posts";
import { usePost } from "../../contexts/PostContext";
import { downloadFile } from "./downloadFile";
import { saveFile } from "./saveFile";
import { useModal } from "../../contexts/ModalContext";
import { useDeletePostStore } from "../../../stores/deletePostStore";

const titles = {
  saving: "Saving Files",
  downloading: "Downloading Files",
};

interface PostMenuProps {
  files: any;
  id: string;
}

const PostMenu = ({ id, files }: PostMenuProps) => {
  const { setTitle, setProgress, setIsDownloaded } = usePost();

  const { postIdToDelete, setPostIdToDelete } = useDeletePostStore();

  const { modalVisible, setModalVisible } = useModal();

  const handleSaveFiles = () => {
    setModalVisible({ ...modalVisible, saveFile: true });
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

  const handleDeleteFile = () => {
    setModalVisible({ ...modalVisible, delete: true });
    console.log("setting post id to delete", id);
    setPostIdToDelete(id);
  };

  return (
    <ContextMenu
      dropdownMenuMode
      actions={[
        { title: "Save to Downloads" },
        { title: "Delete Post", destructive: true },
      ]}
      onPress={(e) => {
        if (e.nativeEvent.index === 0) handleSaveFiles();
        if (e.nativeEvent.index === 1) handleDeleteFile();
      }}
    >
      <TouchableOpacity>
        <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
      </TouchableOpacity>
    </ContextMenu>
  );
};

export default PostMenu;
