import { Text } from "react-native";
import React from "react";

const MAX_FILENAME_LENGTH = 20; // Maximum characters to display for the file name

const TruncatedFileName: React.FC<{ fileName: string }> = ({ fileName }) => {
  const truncatedName = () => {
    if (fileName.length <= MAX_FILENAME_LENGTH) {
      return fileName;
    }
    const extensionIndex = fileName.lastIndexOf(".");
    const fileExt = fileName.slice(extensionIndex);
    const truncated = fileName.slice(0, MAX_FILENAME_LENGTH - fileExt.length);
    return `${truncated}...${fileExt}`;
  };

  return <Text>{truncatedName()}</Text>;
};

export default TruncatedFileName;