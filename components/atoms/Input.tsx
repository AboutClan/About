import {
  Input as ChakraInput,
  InputGroup as ChakraInputGroup,
  InputLeftElement,
  type InputProps as ChakraInputProps,
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
        pl="44px"
        h="52px"
        value={value}
        ref={ref}
        isDisabled={isDisabled}
        onChange={onChange}
        placeholder={placeholder}
        focusBorderColor={props?.h === "44px" ? "none" : "#00c2b3"}
        backgroundColor="white"
        disabled={disabled}
        fontWeight={300}
        fontSize="13px"
        border="1px solid var(--gray-200)"
        borderRadius="12px"
        _placeholder={{ color: "var(--gray-500)" }}
        _focus={{
          outline: props?.h === "44px" ? "none" : undefined,
          boxShadow: props?.h === "44px" ? "none" : undefined,
          border: props?.h === "44px" ? "1px solid var(--gray-200)" : undefined,
        }}
        {...props}
      />
      <InputLeftElement h="100%" display="flex" pl={2}>
        {icon || <SearchIcon />}
      </InputLeftElement>
    </ChakraInputGroup>
  );
});
function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="var(--color-gray)"
    >
      <path d="M380-320q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l224 224q11 11 11 28t-11 28q-11 11-28 11t-28-11L532-372q-30 24-69 38t-83 14Zm0-80q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
    </svg>
  );
}
