import * as React from "react";
import { TouchableOpacity } from "react-native";

interface CreatePost2CardProps {
  children: React.ReactNode;
  handlePress: () => void;
}

const CreatePost2Card = ({ children, handlePress }: CreatePost2CardProps) => {
  return (
    <TouchableOpacity
      style={{ flex: 1, maxWidth: "30%", height: 100 }}
      className="p-3 m-2 justify-center items-center border border-dashed rounded-lg"
      onPress={handlePress}
    >
      {children}
    </TouchableOpacity>
  );
};

export default CreatePost2Card;
