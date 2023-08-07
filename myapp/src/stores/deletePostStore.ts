import { create } from "zustand";

interface DeletePostState {
  postIdToDelete: string;
  setPostIdToDelete: (postId: string) => void;
}

export const useDeletePostStore = create<DeletePostState>((set) => ({
  postIdToDelete: "",
  setPostIdToDelete: (postId) =>
    set((state) => ({
      postIdToDelete: postId,
    })),
}));
