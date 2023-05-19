import React from "react";
import { createContext } from "react";

interface AuthContextType {
  isDownloaded: boolean;
  progress: number;
  title: string;
  modalVisible: boolean;
  setProgress: (progress: number) => void;
  setIsDownloaded: (isDownloaded: boolean) => void;
  setTitle: (text: string) => void;
  setModalVisible: (isVisible: boolean) => void;
}
export const PostContext = createContext<AuthContextType>({
  isDownloaded: false,
  progress: 0,
  title: "",
  modalVisible: false,
  setProgress: function (progress: number): void {},
  setIsDownloaded: function (isDownloaded: boolean): void {},
  setTitle: function (text: string): void {},
  setModalVisible: function (isVisible: boolean): void {},
});

// This hook can be used to access the user info.
export function useFile() {
  return React.useContext(PostContext);
}
