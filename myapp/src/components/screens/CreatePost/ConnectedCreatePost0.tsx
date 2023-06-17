import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { constants } from "../../../constants";
import { useFragment } from "../../../gql";
import { Tag_Fragment } from "../../../graphql/query/post/posts";
import { tagsQueryDocument } from "../../../graphql/query/tag/tags";
import { graphqlRequestClient } from "../../../graphql/requestClient";
import ViewCreatePost0 from "./ViewCreatePost0";

export interface PostTypeData {
  title: string;
  description: string;
  icon: JSX.Element;
  type?: string;
}

const postTypesData: PostTypeData[] = [
  {
    title: "Sınaq",
    description:
      "İmtahan sualları, sınaqlar və ya istədiyiniz fənnə aid quizlər əlavə edin.",
    icon: (
      <MaterialCommunityIcons
        name="file-document-multiple-outline"
        size={24}
        color="black"
      />
    ),
  },
  {
    type: constants.NEWS_TAG_CODE,
    title: "Məlumat",
    description:
      "Yeniliklər imtahanlar, sınaqlar və daha çoxu haqqında son xəbərləri paylaşın.",
    icon: <Feather name="message-square" size={24} color="black" />,
  },
];

const useGetNewsTagId = () => {
  const { data } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => graphqlRequestClient.request(tagsQueryDocument),
    // networkMode: "offlineFirst",
  });

  let newsTagId = "";
  data?.tags?.map((t) => {
    const tag = useFragment(Tag_Fragment, t);
    if (tag.code.toUpperCase() == constants.NEWS_TAG_CODE) newsTagId = tag.id;
  });

  return newsTagId;
};

const ConnectedCreatePost0 = () => {
  const newsTagId = useGetNewsTagId();
  return (
    <ViewCreatePost0 newsTagId={newsTagId} postTypesData={postTypesData} />
  );
};

export default ConnectedCreatePost0;
