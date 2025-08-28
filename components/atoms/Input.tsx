import {
  Input as ChakraInput,
  InputGroup as ChakraInputGroup,
  type InputProps as ChakraInputProps,
  InputRightElement,
} from "@chakra-ui/react";
import { type ForwardedRef,forwardRef } from "react";

type InputProps = ChakraInputProps & {
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  isLine?: boolean;
};

export const Input = forwardRef(function Input(
  { size = "lg", isLine, ...inputProps }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <ChakraInput
      ref={ref}
      focusBorderColor="#00c2b3"
      fontSize="13px"
      height={size === "lg" ? "52px" : size === "md" ? "48px" : "32px"}
      fontWeight="regular"
      lineHeight="20px"
      backgroundColor={isLine ? "inherit" : "white"}
      borderColor="var(--gray-200)"
      border={isLine ? "none" : undefined}
      borderBottom={isLine && "1px solid var(--gray-200)"}
      borderRadius={isLine ? "none" : size === "lg" ? "8px" : "4px"}
      _focus={{
        outline: isLine ? "none" : undefined,
        boxShadow: isLine ? "none" : undefined,
      }}
      {...inputProps}
    />
  );
});

interface InputGroupProps extends InputProps {
  icon?: React.ReactNode;
}

export const InputGroup = forwardRef(function InputGroup(
  { isDisabled, value, onChange, placeholder, disabled, icon, ...props }: InputGroupProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <ChakraInputGroup display="flex" alignItems="center">
      <ChakraInput
        pl="20px"
        h="52px"
        value={value}
        ref={ref}
        isDisabled={isDisabled}
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
        {...props}
      />
      <InputRightElement h="100%" display="flex" pr="8px">
        {icon || (
          <i
            className="fa-solid fa-magnifying-glass fa-sm"
            style={{ color: "var(--color-mint)" }}
          />
        )}
      </InputRightElement>
    </ChakraInputGroup>
  );
});
