import React from "react";

import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  Text,
  View,
  ViewProps,
} from "react-native";

import {
  UseControllerProps,
  useController,
  useFormContext,
} from "react-hook-form";
import clsx from "clsx";

interface TextInputProps extends RNTextInputProps, UseControllerProps {
  label?: string;
  name: string;
  defaultValue?: string;
  setFormError: Function;
  icon?: React.ReactElement;
  containerProps?: ViewProps;
  inputContainerProps?: ViewProps;
}

const ControlledInput = (props: TextInputProps) => {
  const formContext = useFormContext();
  const { formState } = formContext;

  const {
    name,
    label,
    rules,
    defaultValue,
    icon,
    inputContainerProps,
    containerProps,
    ...inputProps
  } = props;

  const { field } = useController({ name, rules, defaultValue });

  const hasError = Boolean(formState?.errors[name]);

  return (
    <View className={containerProps?.className}>
      {label && (
        <Text
          className={clsx(
            "text-xs text-darkGray mb-2",
            hasError && "text-red-500"
          )}
        >
          {label}
        </Text>
      )}
      <View>
        <View
          {...inputContainerProps}
          className={clsx(
            "flex-row items-center",
            inputContainerProps?.className,
            hasError && "border-b-red-500"
          )}
        >
          {icon && <View className="mr-3">{icon}</View>}
          <RNTextInput
            autoCapitalize="none"
            textAlign="left"
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            {...inputProps}
            className={clsx("mb-2 flex-1", inputProps?.className)}
          />
        </View>

        <View>
          {hasError && (
            <Text className="text-red-500 mt-2">
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
