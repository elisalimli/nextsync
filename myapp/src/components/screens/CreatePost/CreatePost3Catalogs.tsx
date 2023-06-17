import * as React from "react";
import { ScrollView, Text, View } from "react-native";
import { constants } from "../../../constants";
import { useFragment } from "../../../gql";
import { Tag_FragmentFragment } from "../../../gql/graphql";
import { Catalog_Fragment } from "../../../graphql/query/post/posts";
import CreatePost3Tag from "./CreatePost3Tag";

interface CreatePost3CatalogsProps {
  catalogTags: Record<string, Tag_FragmentFragment[]>;
  tagIds: string[];
}
const CreatePost3Catalogs: any = ({
  catalogTags,
  tagIds,
}: CreatePost3CatalogsProps) => {
  return Object.keys(catalogTags).map((v) => {
    const currentCatalog = catalogTags[v];
    const catalog = useFragment(Catalog_Fragment, currentCatalog[0].catalog);

    // if one of the tags selected
    let isTagSelected = false;

    // checking if any tags selected in current catalog
    tagIds.map((tagIdx) => {
      const filteredTags = currentCatalog.filter((t) => t.id == tagIdx);
      if (filteredTags?.length == 1) isTagSelected = true;
    });

    if (catalog) {
      return (
        <View className="mb-4">
          {/* Catalog Header */}
          <Text className="mb-2 text-base font-semibold">{catalog?.name}</Text>
          {/* Tags */}
          <ScrollView horizontal>
            {currentCatalog.map((tag) => {
              const tagIdx = tagIds.indexOf(tag.id);
              const isActive = tagIdx !== -1;

              if (tag.code == constants.NEWS_TAG_CODE) return null;

              return (
                <CreatePost3Tag
                  key={`create-post-catalog-${tag.id}`}
                  catalog={catalog}
                  tag={tag}
                  isActive={isActive}
                  isTagSelected={isTagSelected}
                />
              );
            })}
          </ScrollView>
        </View>
      );
    }
  });
};

export default CreatePost3Catalogs;
