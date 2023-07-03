import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { truncateFileName } from "../../Home/TruncatedFileName";
import { Ionicons } from "@expo/vector-icons";

interface IListItemProps {
  fileName: string;
}

const ListItem = ({ fileName }: IListItemProps) => {
  return (
    <View className="flex-row items-center ml-4">
      {/* Re-order icon */}
      <Ionicons name="reorder-two-outline" size={28} color="#8F92A1" />
      {/* File name */}
      <Text className="text-darkGray text-lg lowercase">
        {truncateFileName(fileName)}
      </Text>
    </View>
  );
};

export default ListItem;
