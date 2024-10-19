import {
  Textarea as ChakraTextarea,
  type TextareaProps as ChakraTextareaProps,
} from "@chakra-ui/react";
import { ForwardedRef, forwardRef } from "react";

import { DispatchBoolean } from "../../types/hooks/reactTypes";

type TextareaProps = ChakraTextareaProps & {
  minHeight?: number;

  isFocus?: boolean;
  setIsFocus?: DispatchBoolean;
};

const Textarea = forwardRef(function Textarea(
  { minHeight, setIsFocus, ...textareaProps }: TextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>,
) {
  return (
    <ChakraTextarea
      ref={ref}
      py={4}
      px={5}
      focusBorderColor="#00c2b3"
      minHeight={minHeight || "56px"}
      backgroundColor="white"
      onFocus={() => setIsFocus && setIsFocus(true)}
      onBlur={() => setIsFocus && setIsFocus(false)}
      fontSize="13px"
      fontWeight={300}
      borderRadius="12px"
      _placeholder={{
        color: "var(--gray-500)",
      }}
      {...textareaProps}
    />
  );
});

export default Textarea;
