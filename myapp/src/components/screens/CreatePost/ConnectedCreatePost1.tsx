import { yupResolver } from "@hookform/resolvers/yup";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useCreatePostStore } from "../../../stores/createPostStore";
import ViewCreatePost1 from "./ViewCreatePost1";

const schema = yup
  .object()
  .shape({
    title: yup.string().trim().required("Başlıq boş ola bilməz!"),
    description: yup.string(),
  })
  .required();

export interface CreatePostFormValues {
  title: string;
  description: string;
}
const ConnectedCreatePost1 = () => {
  const { setFormValues } = useCreatePostStore();
  // useForm hook and set default behavior/values
  const methods = useForm<CreatePostFormValues>({
    mode: "onChange",
    values: {
      title: "",
      description: "",
    },

    resolver: yupResolver(schema),
  });

  return <ViewCreatePost1 methods={methods} setFormValues={setFormValues} />;
};

export default ConnectedCreatePost1;
