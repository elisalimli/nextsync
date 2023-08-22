import * as React from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { View } from "react-native";
import { TextInput } from "../../Form/TextInput";
import { CreatePostFormValues } from "./ConnectedCreatePost1";

interface CreatePost1FormProps {
  methods: UseFormReturn<CreatePostFormValues, any>;
}

const CreatePost1Form = ({ methods }: CreatePost1FormProps) => {
  const [_, setError] = React.useState<Boolean>(false);

  return (
    <FormProvider {...methods}>
      <View className="flex-1 py-4 px-8">
        <TextInput
          className="text-3xl mb-4"
          name="title"
          placeholder="Başlığı daxil edin..."
          keyboardType="default"
          setFormError={setError}
        />

        <TextInput
          multiline
          className="text-lg"
          name="description"
          placeholder="Açıqlamanı daxil edin..."
          keyboardType="default"
          setFormError={setError}
        />
      </View>
    </FormProvider>
  );
};

export default CreatePost1Form;
