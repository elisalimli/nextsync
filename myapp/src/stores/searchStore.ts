import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SearchState {
  activeTagIds: string[];
  addTag: (newTagId: string) => void;
  removeTag: (tagId: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  activeTagIds: [],
  addTag: (newTagId) =>
    set((state) => {
      const newTags = state.activeTagIds;
      newTags.push(newTagId);
      return { activeTagIds: newTags };
    }),
  removeTag: (tagId) =>
    set((state) => {
      const tagIds = state?.activeTagIds;

      const index = tagIds.indexOf(tagId);
      if (index > -1) tagIds.splice(index, 1);
      return { activeTagIds: tagIds };
    }),
}));
