import { useInfiniteQuery } from "@tanstack/react-query";
import { constants } from "../../constants";
import {
  Post_Fragment,
  postsQueryDocument,
} from "../../graphql/query/post/posts";
import { useSearchStore } from "../../stores/searchStore";
import React, { useMemo } from "react";
import { useFragment } from "../../gql";
import { graphqlRequestClient } from "../../graphql/requestClient";

export const useGetPosts = () => {
  const { activeTagIds, searchQuery } = useSearchStore();
  const query = useInfiniteQuery({
    queryKey: [
      "posts",
      {
        activeTagIds,
        searchQuery,
      },
    ],
    queryFn: ({ pageParam }) =>
      graphqlRequestClient.request(postsQueryDocument, {
        input: {
          limit: constants.POSTS_QUERY_LIMIT,
          cursor: pageParam?.cursor ? pageParam.cursor : undefined,
          tagIds: activeTagIds?.length ? activeTagIds : undefined,
          searchQuery: searchQuery ? searchQuery : undefined,
        },
      }),

    // networkMode: "offlineFirst",
  });

  const { data, fetchNextPage } = query;

  const allItems = useMemo(
    () => data?.pages?.flatMap((page) => page.posts?.posts),
    [data]
  );

  const lastPage = useMemo(() => data?.pages[data?.pages?.length - 1], [data]);

  const handleOnEndReached = async () => {
    if (lastPage?.posts?.hasMore && allItems) {
      const lastPost = useFragment(
        Post_Fragment,
        allItems[allItems.length - 1]
      );

      fetchNextPage({
        pageParam: {
          cursor: lastPost?.createdAt,
        },
      });
    }
  };

  return { lastPage, allItems, handleOnEndReached, ...query };
};
