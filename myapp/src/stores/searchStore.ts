import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SearchState {
  loading: boolean;
  activeTagIds: string[] | null;
  searchQuery: string | null;
  addTag: (newTagId: string) => void;
  removeTag: (tagId: string) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  loading: false,
  activeTagIds: null,
  searchQuery: null,
  addTag: (newTagId) =>
    set((state) => ({
      activeTagIds: [...(state.activeTagIds || []), newTagId],
    })),
  removeTag: (tagId) =>
    set((state) => {
      const tagIds = state?.activeTagIds;
      if (tagIds != null) {
        const index = tagIds.indexOf(tagId);
        if (index > -1) tagIds.splice(index, 1);
      }
      return { activeTagIds: tagIds };
    }),
  setLoading: (loading) =>
    set((state) => {
      return { loading: loading };
    }),

  setSearchQuery: (query) =>
    set((state) => {
      return { searchQuery: query };
    }),
}));
