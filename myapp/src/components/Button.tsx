import React from "react";
import {
  StyleProp,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import clsx from "clsx";

enum ButtonVariant {
  "primary",
  "outline",
  "ghost",
  "blue",
}

enum BorderRadiusVariant {
  "none",
  "sm",
  "rounded",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "full",
}

type ButtonProps = {
  isLoading?: boolean;
  isDarkBg?: boolean;
  variant?: keyof typeof ButtonVariant;
  borderRadius?: keyof typeof BorderRadiusVariant;
  containerClassName?: string;
  textClassName?: string;
  wrappedText?: boolean;
} & TouchableOpacityProps;

const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      children,
      containerClassName,
      textClassName,
      disabled: buttonDisabled,
      isLoading,
      variant = "ghost",
      borderRadius = "lg",
      isDarkBg = false,
      wrappedText = false,
      // For override the style object
      style,
      ...rest
    },
    ref
  ) => {
    const disabled = isLoading || buttonDisabled;
    containerClassName = clsx(
      "flex justify-center items-center rounded-lg p-2",
      variant === "primary" && "bg-primary",
      containerClassName
    );
    textClassName = clsx(variant === "primary" && "text-white", textClassName);
    return (
      <TouchableOpacity
        ref={ref}
        disabled={disabled}
        // [
        //     tw`flex justify-center items-center rounded-lg`,
        //     [variant !== "ghost" && tw`p-4`],
        //     [variant === "primary" && tw`bg-primary`],
        //     [variant === "blue" && tw`bg-blue`],
        //     containerStyle,
        //   ]
        className={containerClassName}
        {...rest}
      >
        {wrappedText ? (
          children
        ) : (
          <Text
            //   [
            //     tw`h4 flex`,
            //     [variant === "primary" && tw`text-white`],
            //     textStyle,
            //   ]
            className={textClassName}
          >
            {children}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
);

export default Button;
