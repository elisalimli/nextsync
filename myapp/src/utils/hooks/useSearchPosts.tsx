import { useEffect } from "react";
import { useSearchStore } from "../../stores/searchStore";

export const useSearchPosts = (refetch, flatListRef) => {
  const { activeTagIds, searchQuery } = useSearchStore();

  useEffect(() => {
    // filtering posts when tags changed
    if (searchQuery != null) refetch({});
  }, [searchQuery]);

  useEffect(() => {
    // filtering posts when tags changed
    const refetchPosts = async () => {
      await refetch();
      // scrolling to top when data refetched
      if (flatListRef?.current)
        flatListRef.current.scrollToOffset({ animated: true, offset: 10 });
    };
    if (activeTagIds != null) refetchPosts();
  }, [activeTagIds?.length]);
};
