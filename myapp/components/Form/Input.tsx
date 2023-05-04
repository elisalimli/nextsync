import { Control, FieldValues, useController } from "react-hook-form";
import { TextInputProps, TextInput, View, Text } from "react-native";
import React from "react";
import { ErrorMessage } from "@hookform/error-message";
import { LoginInput } from "../../src/gql/graphql";

type IInputProps = {
  control: Control<any, any>;
  name: string;
} & TextInputProps;

const Input: React.FC<IInputProps> = ({ control, name, ...rest }) => {
  const { field, formState } = useController({
    control,
    defaultValue: "",
    name,
  });

  return (
    <View>
      <TextInput
        autoCapitalize="none"
        {...rest}
        value={field.value}
        onChangeText={field.onChange}
      />
      <ErrorMessage
        errors={formState?.errors}
        name={name}
        render={({ message }) => <Text>{message}</Text>}
      />
    </View>
  );
};

export default Input;
