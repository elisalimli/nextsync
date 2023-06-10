import { Button, View } from "react-native";

import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";

export default function TabOneScreen() {
  // const [createPostMutate, { loading }] = useMutation(
  //   createPostMutationDocument,
  //   {}
  // );
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
        setDoc(fileToUpload as any);
      }
    });
  };

  const handleSubmit = async () => {
    // const result = await createPostMutate({
    //   variables: {
    //     input: {
    //       files: [
    //         {
    //           file: new ReactNativeFile({
    //             uri: doc?.uri,
    //             name: doc?.name,
    //             type: doc?.type,
    //           }),
    //           id: 1,
    //         },
    //       ],
    //       title: "test",
    //       description: "test description",
    //       grade: 11,
    //       language: LanguageType.Aze,
    //       secondLanguage: SecondLanguageType.Eng,
    //       type: Type.Buraxilis,
    //       variant: "A",
    //     },
    //   },
    // });
  };

  return (
    <View>
      <Button title="Select Document" onPress={pickDocument} />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}
