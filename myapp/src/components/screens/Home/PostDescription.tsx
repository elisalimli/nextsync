import React from "react";
import { Text } from "react-native";

const formatText = (text: string) => {
  const formattedText = [];
  let currentText = "";
  let isBold = false;
  let isItalic = false;
  let isStrikethrough = false;
  let isMonospace = false;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === "*" && text[i + 1] !== "*") {
      if (isBold) {
        formattedText.push(
          <Text key={formattedText.length} style={{ fontWeight: "bold" }}>
            {currentText}
          </Text>
        );
      } else {
        formattedText.push(
          <Text key={formattedText.length}>{currentText}</Text>
        );
      }
      currentText = "";
      isBold = !isBold;
    } else if (text[i] === "_" && text[i + 1] !== "_") {
      if (isItalic) {
        formattedText.push(
          <Text key={formattedText.length} style={{ fontStyle: "italic" }}>
            {currentText}
          </Text>
        );
      } else {
        formattedText.push(
          <Text key={formattedText.length}>{currentText}</Text>
        );
      }
      currentText = "";
      isItalic = !isItalic;
    } else if (text[i] === "~" && text[i + 1] !== "~") {
      if (isStrikethrough) {
        formattedText.push(
          <Text
            key={formattedText.length}
            style={{ textDecorationLine: "line-through" }}
          >
            {currentText}
          </Text>
        );
      } else {
        formattedText.push(
          <Text key={formattedText.length}>{currentText}</Text>
        );
      }
      currentText = "";
      isStrikethrough = !isStrikethrough;
    } else if (text.slice(i, i + 3) === "```") {
      if (isMonospace) {
        formattedText.push(
          <Text key={formattedText.length} style={{ fontFamily: "monospace" }}>
            {currentText}
          </Text>
        );
      } else {
        formattedText.push(
          <Text key={formattedText.length}>{currentText}</Text>
        );
      }
      currentText = "";
      isMonospace = !isMonospace;
      i += 2; // Skip the remaining backticks
    } else {
      currentText += text[i];
    }
  }

  // Append the remaining text
  formattedText.push(<Text key={formattedText.length}>{currentText}</Text>);

  return formattedText;
};

interface PostDescriptionProps {
  text: string | null | undefined;
}

const PostDescription: React.FC<PostDescriptionProps> = ({ text }) => {
  return <Text>{text && formatText(text)}</Text>;
};

export default PostDescription;
