import { Text, type InputProps as ChakraInputProps } from "@chakra-ui/react";
import { Input } from "../atoms/Input";

interface LabelInputProps extends ChakraInputProps {
  label: string;
}

function LabeledInput({ label, ...inputProps }: LabelInputProps) {
  return (
    <>
      <Text fontSize="11px" fontWeight="medium" color="gray.600" mb={2}>
        {label}
      </Text>
      <Input {...inputProps} size="lg" />
    </>
  );
}

export default LabeledInput;
