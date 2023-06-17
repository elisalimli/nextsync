import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SearchState {
  loading: boolean;
  activeTagIds: string[] | null;
  searchQuery: string | null;
  addTag: (newTagId: string) => void;
  removeAllTags: () => void;
  removeTag: (tagId: string) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
}

const initialState = {
  loading: false,
  activeTagIds: null,
  searchQuery: null,
};

export const useSearchStore = create<SearchState>((set) => ({
  ...initialState,
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
  removeAllTags: () =>
    set((state) => ({
      activeTagIds: [],
    })),
  setLoading: (loading) =>
    set((state) => {
      return { loading: loading };
    }),

  setSearchQuery: (query) =>
    set((state) => {
      return { searchQuery: query };
    }),
  reset: () => {
    set(initialState);
  },
}));
