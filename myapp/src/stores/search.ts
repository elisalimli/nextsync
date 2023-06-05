import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SearchState {
  tags: any[];
  setTags: (newTag: any) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  tags: [],
  setTags: (newTag) => set((state) => ({ tags: [...state.tags, newTag] })),
}));
