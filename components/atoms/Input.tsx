import { Input as ChakraInput } from "@chakra-ui/react";
import { ChangeEventHandler, LegacyRef } from "react";
interface IInput {
  value: string | number | readonly string[];
  inputRef?: LegacyRef<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  disabled?: boolean;
}
export default function Input({ value, inputRef, onChange, placeholder, disabled }: IInput) {
  return (
    <ChakraInput
      value={value}
      ref={inputRef}
      onChange={onChange}
      placeholder={placeholder}
      focusBorderColor="#00c2b3"
      backgroundColor="white"
      disabled={disabled}
      borderColor="var(--gray-300)"
    />
  );
}
