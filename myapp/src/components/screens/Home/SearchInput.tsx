import React, { useEffect } from "react";
import { useController, useForm } from "react-hook-form";
import { TextInput } from "react-native-gesture-handler";
import { useSearchStore } from "../../../stores/searchStore";
import { useDebounce } from "../../../utils/hooks/useDebounce";

const SearchInput = () => {
  const { setSearchQuery } = useSearchStore();
  const { control } = useForm();
  const { field } = useController({
    control,
    defaultValue: null,
    name: "searchQuery",
  });
  const debouncedValue = useDebounce<string>(field.value, 500);

  useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue]);

  // useEffect(() => setLoading(loading), [loading]);

  const handleChange = async (text: string) => field.onChange(text);

  return <TextInput className="bg-white flex-1" onChangeText={handleChange} />;
};

export default SearchInput;
