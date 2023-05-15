import { AntDesign } from "@expo/vector-icons";
import * as React from "react";
import { useEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import RNFetchBlob, {
  FetchBlobResponse,
  StatefulPromise,
} from "react-native-blob-util";
import * as Progress from "react-native-progress";
import { File_FragmentFragment } from "../../../gql/graphql";
import FileSizeDisplay from "./FileSizeDisplay";

interface FileProps {
  file: File_FragmentFragment;
}

const File: React.FC<FileProps> = ({
  file: { id, url, fileSize, fileName: displayName },
}) => {
  const [task, setTask] = useState<StatefulPromise<FetchBlobResponse> | null>(
    null
  );
  const [fileExists, setFileExists] = useState(false);
  const [fileDest, setFileDest] = useState("");
  const [progress, setProgress] = useState(0);
  const fileName = url.split("/").pop() as string;

  useEffect(() => {
    (async () => {
      let documentDir = "";
      if (Platform.OS === "android") documentDir = RNFetchBlob.fs.dirs.DCIMDir;
      else if (Platform.OS === "ios")
        documentDir = RNFetchBlob.fs.dirs.DocumentDir;

      const fileDest = `${documentDir}/${fileName}`;

      console.log(fileDest);
      const fileExists = await RNFetchBlob.fs.exists(fileDest);
      setFileExists(fileExists);
      setFileDest(fileDest);
    })();
  }, []);

  const downloadFromUrl = async (url: string) => {
    // fs: Directory path where we want our image to download
    const { config, fs } = RNFetchBlob;

    if (!fileExists) {
      let options = {
        path: fileDest,
        fileCache: true,
        addAndroidDownloads: {
          // Related to the Android only
          useDownloadManager: true,
          notification: true,

          path: fileDest,
          description: "Pdf",
        },
      };

      let task = config(options)
        .fetch("GET", url)
        .progress((received, total) => {
          console.log("progress", received / total);
          setProgress(received / total);
        });
      setTask(task);
      task.then(async (res) => {
        // Showing alert after successful downloading
        alert("File Downloaded Successfully.");
        setProgress(1);
        setFileExists(true);
      });

      //   task.cancel((err) => {});
    }
  };
  function handleOpen() {
    if (Platform.OS === "android") {
      RNFetchBlob.android.actionViewIntent(fileDest, "application/pdf");
    } else if (Platform.OS === "ios") {
      RNFetchBlob.ios.previewDocument(fileDest);
    }
  }

  function cancelRequest() {
    if (task) {
      try {
        task.cancel((err) => {
          console.log("download request is cancelled", err);
          setTask(null);
          setProgress(0);
          // Remove the downloaded file
          RNFetchBlob.fs
            .unlink(fileDest)
            .then(() => {
              console.log("File removed successfully");
              setFileExists(false);
            })
            .catch((error) => {
              console.log("Error removing file", error);
            });
        });
      } catch (error) {
        console.log("Cancelling error:", error);
      }
    }
  }

  return (
    <View>
      {/* {fileExists ? ( */}
      <View className="flex-row">
        <View className="bg-primary p-2 rounded-lg">
          {fileExists ? (
            <TouchableOpacity onPress={handleOpen}>
              <AntDesign name="pdffile1" size={24} color="#DBEAFE" />
            </TouchableOpacity>
          ) : (
            <View>
              {task ? (
                <TouchableOpacity onPress={cancelRequest}>
                  <Progress.Circle size={24} progress={progress} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => downloadFromUrl(url)}>
                  <Text>
                    <AntDesign name="download" size={24} color="#DBEAFE" />
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        <View className="ml-3 flex justify-center">
          <Text>{displayName}</Text>
          <FileSizeDisplay fileSize={fileSize} />
        </View>
      </View>
    </View>
  );
};

export default File;
