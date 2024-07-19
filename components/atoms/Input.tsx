import {
  Input as ChakraInput,
  InputGroup as ChakraInputGroup,
  InputLeftElement,
  type InputProps as ChakraInputProps,
} from "@chakra-ui/react";
import { type ForwardedRef, forwardRef } from "react";

type InputProps = ChakraInputProps & {
  size?: "xs" | "sm" | "md";
  disabled?: boolean;
};

export const Input = forwardRef(function Input(
  { size = "md", ...inputProps }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <ChakraInput
      ref={ref}
      focusBorderColor="#00c2b3"
      backgroundColor={size === "sm" ? "inherit" : "white"}
      borderColor="var(--gray-300)"
      size={size}
      border={size === "sm" && "none"}
      borderBottom={size === "sm" && "var(--border-main)"}
      borderRadius={size === "sm" && "none"}
      _focus={{
        outline: size === "sm" ? "none" : undefined,
        boxShadow: size === "sm" ? "none" : undefined,
      }}
      {...inputProps}
    />
  );
});

interface InputGroupProps extends InputProps {
  icon: React.ReactNode;
}

export const InputGroup = forwardRef(function InputGroup(
  { icon, value, onChange, placeholder, disabled }: InputGroupProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <ChakraInputGroup>
      <InputLeftElement pointerEvents="none">{icon}</InputLeftElement>
      <ChakraInput
        pl="36px"
        value={value}
        ref={ref}
        onChange={onChange}
        placeholder={placeholder}
        focusBorderColor="#00c2b3"
        backgroundColor="white"
        disabled={disabled}
        borderColor="var(--gray-300)"
      />
    </ChakraInputGroup>
  );
});
