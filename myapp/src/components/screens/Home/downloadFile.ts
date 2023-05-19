import RNFS, { DownloadProgressCallbackResult } from "react-native-fs";
import { constants } from "../../../constants";

export async function downloadFile(
  fileName: string,
  url: string,
  setTitle: any,
  setProgress: any
) {
  const documentDir = RNFS.CachesDirectoryPath;
  const sourceFilePath = `${documentDir}/${fileName}`;
  const destinationFilePath = `${constants.folderPath}/${fileName}`;
  const fileExists = await RNFS.exists(sourceFilePath);

  if (!fileExists) {
    setTitle("downloading files");
    const options: RNFS.DownloadFileOptions = {
      fromUrl: url,
      toFile: sourceFilePath,
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
    await RNFS.downloadFile(options).promise;
  }
  return [sourceFilePath, destinationFilePath];
}