import { AntDesign } from "@expo/vector-icons";
import * as React from "react";
import { useEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";
import RNFS, { DownloadProgressCallbackResult } from "react-native-fs";
import { File_FragmentFragment } from "../../../gql/graphql";
import FileSizeDisplay from "./FileSizeDisplay";
import RNFetchBlob from "rn-fetch-blob";
import TruncatedFileName from "./TruncatedFileName";

interface FileProps {
  file: File_FragmentFragment;
}

const File: React.FC<FileProps> = ({
  file: { id, url, fileSize, fileName: displayName, contentType },
}) => {
  const [jobId, setJobId] = useState<number | null>(null);
  const [fileExists, setFileExists] = useState(false);
  const [fileDest, setFileDest] = useState("");
  const [progress, setProgress] = useState(0);
  const fileName = url.split("/").pop() as string;

  useEffect(() => {
    const checkFileExists = async () => {
      const documentDir = RNFS.CachesDirectoryPath;
      const fileDest = `${documentDir}/${fileName}`;

      console.log(fileDest);
      const fileExists = await RNFS.exists(fileDest);
      setFileExists(fileExists);
      setFileDest(fileDest);
    };

    checkFileExists();
  }, []);

  const downloadFromUrl = async (url: string) => {
    if (!fileExists) {
      const options: RNFS.DownloadFileOptions = {
        fromUrl: url,
        toFile: fileDest,
        background: true,
        begin: () => {
          setProgress(0);
        },
        progress: (res: DownloadProgressCallbackResult) => {
          const progress = res.bytesWritten / res.contentLength;
          console.log("Download progress", progress);
          setProgress(progress);
        },
        progressDivider: 10,
      };
      const downloadTask = RNFS.downloadFile(options);

      setJobId(downloadTask?.jobId);

      try {
        const res = await downloadTask.promise;
        alert("File Donwload Completed");
        console.log("Download complete", res);
        setProgress(1);
        setFileExists(true);
      } catch (error) {
        console.log("Download error", error);
      }
    }
  };

  function handleOpen() {
    if (Platform.OS === "android") {
      RNFetchBlob.android.actionViewIntent(fileDest, contentType);
    } else if (Platform.OS === "ios") {
      RNFetchBlob.ios.previewDocument(fileDest);
    }
  }

  function cancelRequest() {
    if (jobId) {
      RNFS.stopDownload(jobId);
      setJobId(null);
      setProgress(0);
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
              {jobId ? (
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
          <TruncatedFileName fileName={displayName} />
          <FileSizeDisplay fileSize={fileSize} />
        </View>
      </View>
    </View>
  );
};

export default File;
