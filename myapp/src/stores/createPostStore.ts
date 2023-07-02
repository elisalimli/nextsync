import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { CreatePostFormValues } from "../components/screens/CreatePost/ConnectedCreatePost1";
import { ColorValue } from "react-native";

export interface FileUpload {
  name: string;
  size: number | undefined;
  uri: string;
  type: string;
}

export interface IDoc {
  id: number;
  doc: FileUpload;
}

interface CreatePostState {
  docs: IDoc[];
  tagIds: string[];
  formValues: CreatePostFormValues;
  setFormValues: (newFormValues: CreatePostFormValues) => void;
  setDocs: (docs: IDoc[]) => void;
  addTag: (newTagId: string) => void;
  reset: () => void;
}

const initialState = {
  docs: [],
  tagIds: [],
  formValues: { description: "", title: "" },
};

export const useCreatePostStore = create<CreatePostState>((set) => ({
  ...initialState,
  setFormValues: (newFormValues) =>
    set((state) => ({
      formValues: newFormValues,
    })),
  setDocs: (docs) =>
    set((state) => ({
      docs,
    })),
  addTag: (tagId: string) =>
    set((state) => {
      let tagIds = state?.tagIds;
      if (tagIds != null) {
        const index = tagIds.indexOf(tagId);
        if (index > -1) tagIds.splice(index, 1);
        else tagIds = [...(state.tagIds || []), tagId];
      }
      return { tagIds };
    }),
  reset: () => {
    set(initialState);
  },
}));
