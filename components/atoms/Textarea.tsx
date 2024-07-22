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
      focusBorderColor="#00c2b3"
      minHeight={minHeight}
      backgroundColor="white"
      onFocus={() => setIsFocus && setIsFocus(true)}
      onBlur={() => setIsFocus && setIsFocus(false)}
      {...textareaProps}
    />
  );
});

export default Textarea;
