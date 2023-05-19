import RNFetchBlob from "react-native-blob-util";

export async function saveFile(
  sourceFilePath: string,
  destinationFilePath: string,
  lastElement: boolean,
  setProgress: any,
  setIsDownloaded: any,
  setModalVisible: any
) {
  // RNFetchBlob.fs.cp(sourceFilePath, destinationFilePath);
  const chunkSize = 1024 * 10000; // 10mb
  let bytesRead = 0;
  let totalBytes = 0;

  // // Get the total size of the file
  RNFetchBlob.fs.stat(sourceFilePath).then((stats) => {
    totalBytes = stats.size;
    console.log(totalBytes);
  });

  // Create a ReadStream for the source file
  const readStream = await RNFetchBlob.fs.readStream(
    sourceFilePath,
    "base64",
    chunkSize
  );
  console.log(readStream);

  // Create a WriteStream for the destination file
  const writeStream = await RNFetchBlob.fs.writeStream(
    destinationFilePath,
    "base64",
    true
  );

  // Handle events for the ReadStream
  readStream.open();

  readStream.onData((chunk) => {
    // Write the chunk to the destination file
    writeStream.write(chunk as string);
    // Update bytesRead and calculate progress
    bytesRead += chunkSize;
    const progress = bytesRead / totalBytes;
    setProgress(progress);
    console.log(`Progress: ${progress}%`);
  });

  readStream.onEnd(() => {
    console.log("end");
    if (lastElement) {
      setModalVisible(false);
      setIsDownloaded(true);
    }
    setProgress(0);
    // Close the WriteStream
    writeStream.close();
  });
}
