import RNFS, { DownloadProgressCallbackResult } from "react-native-fs";
import { constants } from "../../../constants";

export async function downloadFile(
  fileName: string,
  url: string,
  setTitle: any,
  setProgress: any
) {
  const cachesDir = RNFS.CachesDirectoryPath;
  const sourceFilePath = `${cachesDir}/${fileName}`;
  const fileExists = await RNFS.exists(sourceFilePath);

  if (!fileExists) {
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
  return sourceFilePath;
}
