import {
  Input as ChakraInput,
  InputGroup as ChakraInputGroup,
  type InputProps as ChakraInputProps,
  InputRightElement,
} from "@chakra-ui/react";
import { type ForwardedRef,forwardRef } from "react";

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
      border={size === "sm" ? "none" : undefined}
      borderBottom={size === "sm" && "1px solid var(--gray-200)"}
      borderRadius={size === "sm" ? "none" : "4px"}
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
    <ChakraInputGroup display="flex" alignItems="center">
      <ChakraInput
        pl="20px"
        h="52px"
        value={value}
        ref={ref}
        onChange={onChange}
        placeholder={placeholder}
        focusBorderColor="#00c2b3"
        backgroundColor="white"
        disabled={disabled}
        fontWeight={300}
        fontSize="13px"
        border="1px solid var(--gray-200)"
        borderRadius="12px"
        _placeholder={{ color: "var(--gray-500)" }}
      />
      <InputRightElement h="100%" display="flex" pr="8px">
        <i className="fa-solid fa-magnifying-glass fa-sm" style={{ color: "var(--color-mint)" }} />
      </InputRightElement>
    </ChakraInputGroup>
  );
});
