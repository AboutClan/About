import { Box } from "@chakra-ui/react";

interface TextDeviderProps {
  text: string;
}

function TextDevider({ text }: TextDeviderProps) {
  return (
    <Box px={4} py={2} bgColor="var(--gray-200)" fontWeight={600} color="var(--gray-600)">
      {text}
    </Box>
  );
}

export default TextDevider;
