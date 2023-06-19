import * as DocumentPicker from "expo-document-picker";
import * as React from "react";
import { StyleSheet } from "react-native";
import { FileUpload } from "../../../stores/createPostStore";
import ViewCreatePost2 from "./ViewCreatePost2";

const ConnectedCreatePost2 = () => {
  const [docs, setDocs] = React.useState<FileUpload[]>([]);

  const pickDocument = async () => {
    await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/png", "image/jpeg", "image/jpg"],
      multiple: true,
      copyToCacheDirectory: false,
    }).then(async (response) => {
      if (response.type == "success") {
        let { name, size, uri } = response;
        let nameParts = name.split(".");
        let fileType = nameParts[nameParts.length - 1];
        var fileToUpload = {
          uri,
          name,
          size: size,
          type: "application/" + fileType,
        };

        const filteredDocs = docs?.filter((doc) => doc.uri != uri);

        // adding only if file not already in the list
        if (filteredDocs?.length == docs?.length)
          setDocs([...(docs || []), fileToUpload]);
      }
    });
  };

  return <ViewCreatePost2 pickDocument={pickDocument} docs={docs} />;
};

export default ConnectedCreatePost2;
