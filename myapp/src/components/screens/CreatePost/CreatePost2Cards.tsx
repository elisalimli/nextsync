import { Feather } from "@expo/vector-icons";
import * as React from "react";
import { FlatList, Text } from "react-native";
import { FileUpload } from "../../../stores/createPostStore";
import CreatePost2Card from "./CreatePost2Card";

interface CreatePost2CardsProps {
  docs: FileUpload[];
  pickDocument: () => void;
}

const CreatePost2Cards = ({ docs, pickDocument }: CreatePost2CardsProps) => {
  return (
    <FlatList
      // 2,5,8,11
      data={[{} as any, ...(docs || [])]}
      numColumns={3}
      renderItem={({ item, index }) =>
        index == 0 ? (
          <CreatePost2Card
            handlePress={pickDocument}
            key={`file-uploads-add-button`}
          >
            <Feather name="plus" size={24} color="black" />
            <Text className="font-semibold">Fayl əlavə edin</Text>
          </CreatePost2Card>
        ) : (
          <CreatePost2Card
            handlePress={pickDocument}
            key={`file-uploads-${item.name}`}
          >
            <Text>{item.name}</Text>
          </CreatePost2Card>
        )
      }
      keyExtractor={(item, i) => item.name + i}
    />
  );
};

export default CreatePost2Cards;
