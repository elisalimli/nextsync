import { Button, View } from "react-native";

import React, { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useMutation } from "@apollo/client";
import { createPostMutationDocument } from "../../src/graphql/mutation/post/createPost";
import { LanguageType, SecondLanguageType } from "../../src/gql/graphql";
import { Type } from "../../src/gql/graphql";
import { ReactNativeFile } from "apollo-upload-client";

export default function TabOneScreen() {
  const [createPostMutate, { loading }] = useMutation(
    createPostMutationDocument,
    {}
  );
  const [doc, setDoc] = useState();
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    }).then((response) => {
      if (response.type == "success") {
        let { name, size, uri } = response;
        let nameParts = name.split(".");
        let fileType = nameParts[nameParts.length - 1];
        var fileToUpload = {
          name: name,
          size: size,
          uri: uri,
          type: "application/" + fileType,
        };
        console.log(fileToUpload, "...............file");
        setDoc(fileToUpload as any);
      }
    });
    // console.log(result);
  };

  const handleSubmit = async () => {
    const result = await createPostMutate({
      variables: {
        input: {
          files: [
            {
              file: new ReactNativeFile({
                uri: doc?.uri,
                name: doc?.name,
                type: doc?.type,
              }),
              id: 1,
            },
          ],
          title: "test",
          description: "test description",
          grade: 11,
          language: LanguageType.Aze,
          secondLanguage: SecondLanguageType.Eng,
          type: Type.Buraxilis,
          variant: "A",
        },
      },
    });
    console.log("result", result);
  };

  return (
    <View>
      <Button title="Select Document" onPress={pickDocument} />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}
