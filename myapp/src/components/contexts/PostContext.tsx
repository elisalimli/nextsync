import React from "react";
import { createContext } from "react";

interface PostContextType {
  isDownloaded: boolean;
  progress: number;
  title: string;
  setProgress: (progress: number) => void;
  setIsDownloaded: (isDownloaded: boolean) => void;
  setTitle: (text: string) => void;
}
export const PostContext = createContext<PostContextType>({
  isDownloaded: false,
  progress: 0,
  title: "",
  setProgress: function (progress: number): void {},
  setIsDownloaded: function (isDownloaded: boolean): void {},
  setTitle: function (text: string): void {},
});

export function usePost() {
  return React.useContext(PostContext);
}
