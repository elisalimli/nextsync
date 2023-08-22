import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import BackButton from "../../BackButton";
import Button, { ButtonProps } from "../../Button";

interface CreatePostFooterProps {
  nextButtonProps?: ButtonProps;
  handlePressNext?: () => void;
}

const CreatePostFooter = ({
  nextButtonProps,
  handlePressNext,
}: CreatePostFooterProps) => {
  return (
    <View className="w-full flex-row justify-between px-4 pt-8">
      <BackButton>
        <Button
          shouldApplyDisabledStyle={false}
          disabled
          variant="ghost"
          textClassName="uppercase font-semibold"
          containerClassName="rounded-full py-3 px-12"
        >
          Geri
        </Button>
      </BackButton>
      <Button
        onPress={handlePressNext}
        variant="primary"
        textClassName="uppercase font-semibold"
        containerClassName="rounded-full py-3 px-12"
        {...nextButtonProps}
      >
        Davam
      </Button>
    </View>
  );
};

export default CreatePostFooter;
