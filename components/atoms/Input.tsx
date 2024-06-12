import {
  Input as ChakraInput,
  InputGroup as ChakraInputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { ChangeEventHandler, HTMLInputTypeAttribute, LegacyRef } from "react";
interface IInput {
  value: string | number | readonly string[];
  inputRef?: LegacyRef<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  disabled?: boolean;
  type?: HTMLInputTypeAttribute | undefined;
  size?: "sm" | "md";
}
export function Input({ size = "md", value, inputRef, onChange, placeholder, disabled }: IInput) {
  return (
    <ChakraInput
      value={value}
      ref={inputRef}
      onChange={onChange}
      placeholder={placeholder}
      focusBorderColor="#00c2b3"
      backgroundColor={size === "sm" ? "inherit" : "white"}
      disabled={disabled}
      borderColor="var(--gray-300)"
      size={size}
      border={size === "sm" && "none"}
      borderBottom={size === "sm" && "var(--border-main)"}
      borderRadius={size === "sm" && "none"}
      _focus={{
        outline: size === "sm" ? "none" : undefined,
        boxShadow: size === "sm" ? "none" : undefined,
      }}
    />
  );
}

interface InputGroupProps extends IInput {
  icon: React.ReactNode;
}

export function InputGroup({
  icon,
  value,
  inputRef,
  onChange,
  placeholder,
  disabled,
}: InputGroupProps) {
  return (
    <ChakraInputGroup>
      <InputLeftElement pointerEvents="none">{icon}</InputLeftElement>
      <ChakraInput
        pl="36px"
        value={value}
        ref={inputRef}
        onChange={onChange}
        placeholder={placeholder}
        focusBorderColor="#00c2b3"
        backgroundColor="white"
        disabled={disabled}
        borderColor="var(--gray-300)"
      />
    </ChakraInputGroup>
  );
}
