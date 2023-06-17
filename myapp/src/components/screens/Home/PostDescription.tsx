import React from "react";
import { Text, View } from "react-native";
import RenderHtml, {
  HTMLSource,
  RenderHTMLSourceProps,
  TNodeChildrenRenderer,
} from "react-native-render-html";
import { constants } from "../../../constants";
import Button from "../../Button";
import { Link } from "expo-router";
import { Post_FragmentFragment } from "../../../gql/graphql";
import { LinearGradient } from "expo-linear-gradient";

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

type PostDescriptionProps = {
  post: Post_FragmentFragment;
  truncate?: boolean;
};

const PostDescription: React.FC<PostDescriptionProps> = ({
  post,
  truncate = false,
}) => {
  const { description, htmlContent, id } = post;

  if (htmlContent) {
    const source = {
      html: truncate ? htmlContent.slice(0, 255) + "..." : htmlContent,
    } as HTMLSource;
    return (
      <View>
        <View className="relative">
          <RenderHtml
            contentWidth={constants.SCREEN_WIDTH}
            source={source}
            // defaultTextProps={{ numberOfLines: 1 }}
          />
        </View>

        {truncate && (
          <Link
            className="text-darkGray2"
            href={{
              pathname: `/post/${id}`,
              // /* 1. Navigate to the details route with query params */
              params: { id: post.id },
            }}
          >
            Read More
          </Link>
        )}
      </View>
    );
  }

  return <Text>{description && formatText(description)}</Text>;
};

export default PostDescription;
