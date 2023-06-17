import React from "react";

import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  Text,
  View,
} from "react-native";

import {
  UseControllerProps,
  useController,
  useFormContext,
} from "react-hook-form";

interface TextInputProps extends RNTextInputProps, UseControllerProps {
  label?: string;
  name: string;
  defaultValue?: string;
  setFormError: Function;
}

const ControlledInput = (props: TextInputProps) => {
  const formContext = useFormContext();
  const { formState } = formContext;

  const { name, label, rules, defaultValue, ...inputProps } = props;

  const { field } = useController({ name, rules, defaultValue });

  const hasError = Boolean(formState?.errors[name]);

  return (
    <View>
      {label && <Text>{label}</Text>}
      <View>
        <RNTextInput
          autoCapitalize="none"
          textAlign="left"
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          {...inputProps}
        />

        <View>
          {hasError && (
            <Text className="text-red-500">
              {formState?.errors[name]?.message as any}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export const TextInput = (props: TextInputProps) => {
  const { name, rules, label, defaultValue, setFormError, ...inputProps } =
    props;

  const formContext = useFormContext();

  // Placeholder until input name is initialized
  if (!formContext || !name) {
    const msg = !formContext
      ? "TextInput must be wrapped by the FormProvider"
      : "Name must be defined";
    console.error(msg);
    setFormError(true);
    return null;
  }

  return <ControlledInput {...props} />;
};
