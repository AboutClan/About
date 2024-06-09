import { Textarea as ChakraTextarea } from "@chakra-ui/react";
import { ChangeEventHandler, LegacyRef } from "react";

import { DispatchBoolean } from "../../types/hooks/reactTypes";
interface ITextarea {
  value: string | number | readonly string[];
  textareaRef?: LegacyRef<HTMLTextAreaElement>;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  minHeight?: number;
  isFocus?: boolean;
  setIsFocus?: DispatchBoolean;
}
export default function Textarea({
  value,
  textareaRef,
  onChange,
  placeholder,
  minHeight,

  setIsFocus,
}: ITextarea) {
  return (
    <ChakraTextarea
      value={value}
      ref={textareaRef}
      onChange={onChange}
      placeholder={placeholder}
      focusBorderColor="#00c2b3"
      minHeight={minHeight}
      backgroundColor="white"
      onFocus={() => setIsFocus && setIsFocus(true)}
      onBlur={() => setIsFocus && setIsFocus(false)}
    />
  );
}
