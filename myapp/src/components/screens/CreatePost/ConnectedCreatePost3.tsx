import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";
import * as React from "react";
import { getAuthAccessToken } from "../../../auth/auth";
import { constants } from "../../../constants";
import { useFragment } from "../../../gql";
import { Tag_FragmentFragment } from "../../../gql/graphql";
import {
  Catalog_Fragment,
  Tag_Fragment,
} from "../../../graphql/query/post/posts";
import { tagsQueryDocument } from "../../../graphql/query/tag/tags";
import { graphqlRequestClient } from "../../../graphql/requestClient";
import { useCreatePostStore } from "../../../stores/createPostStore";
import { useSearchStore } from "../../../stores/searchStore";
import ViewCreatePost3 from "./ViewCreatePost3";

interface ConnectedCreatePost3Props {}

const ConnectedCreatePost3 = (props: ConnectedCreatePost3Props) => {
  const router = useRouter();
  const { formValues, docs, tagIds, reset } = useCreatePostStore();
  const { reset: resetSearch } = useSearchStore();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => graphqlRequestClient.request(tagsQueryDocument),
  });

  // filtering tags by news tag, we don't need to show news tag, beacuse if in first screen news tag selected, we add it to tagIds array
  const tagsWithoutNews = React.useMemo(() => {
    return data?.tags.filter((t) => {
      const tag = useFragment(Tag_Fragment, t);
      return tag.code !== constants.NEWS_TAG_CODE;
    });
  }, [data?.tags]);

  // mapping tags by catalog
  /*
  for example ; catalogTags = {
    'second_language':[...tags]
    'section':[...otherTags]
  }
  */
  let catalogTags = React.useMemo(() => {
    const catalogs: Record<string, Tag_FragmentFragment[]> = {};
    if (tagsWithoutNews) {
      tagsWithoutNews.map((t) => {
        const tag = useFragment(Tag_Fragment, t);
        const catalog = useFragment(Catalog_Fragment, tag.catalog);
        if (catalog)
          catalogs[catalog.code] = [...(catalogs[catalog.code] || []), tag];
      });
    }
    return catalogs;
  }, [tagsWithoutNews]);

  const mutation = useMutation(
    async () => {
      let formData = new FormData();
      formData.append("title", formValues.title);
      formData.append("description", formValues.description);

      docs?.map((doc) => {
        formData.append("files", {
          uri: doc.uri,
          name: doc.name,
          type: doc.type,
        } as any);
      });

      tagIds?.map((tagId) => {
        formData.append("tagIds", tagId);
      });

      let accessToken = await getAuthAccessToken();
      const res = await axios.post(
        `${constants.apiBase}/create-post`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      return res;
    },
    {
      onSuccess: async (data) => {
        if (data.status === 201) {
          await queryClient.resetQueries({ queryKey: ["posts"] });
          router.push("/");
          reset();
          resetSearch();
        }
      },
    }
  );

  return (
    <ViewCreatePost3
      catalogTags={catalogTags}
      handleSubmit={() => mutation.mutate()}
      isLoading={mutation.isLoading}
      tagIds={tagIds}
    />
  );
};

export default ConnectedCreatePost3;
