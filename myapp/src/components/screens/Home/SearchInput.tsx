import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useController, useForm } from "react-hook-form";
import { TextInput } from "react-native-gesture-handler";
import { constants } from "../../../constants";
import { postsQueryDocument } from "../../../graphql/query/post/posts";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import { useSearchStore } from "../../../stores/searchStore";

const SearchInput = () => {
  const { setLoading } = useSearchStore();
  const { control } = useForm();
  const { field } = useController({
    control,
    defaultValue: null,
    name: "searchQuery",
  });
  const debouncedValue = useDebounce<string>(field.value, 500);

  const { refetch, loading } = useQuery(postsQueryDocument, {
    variables: { input: { limit: constants.POSTS_QUERY_LIMIT } },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-only",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    if (debouncedValue) {
      refetch({
        input: { limit: constants.POSTS_QUERY_LIMIT, searchQuery: field.value },
      });
      console.log("refetching");
    }
  }, [debouncedValue]);

  useEffect(() => setLoading(loading), [loading]);

  const handleChange = async (text: string) => field.onChange(text);

  return <TextInput className="bg-white flex-1" onChangeText={handleChange} />;
};

export default SearchInput;
