import { Box } from "@chakra-ui/react";

interface DiffTwoBlockColProps {
  text: string;
  subText: string;
}

function DiffTwoBlockCol({ text, subText }: DiffTwoBlockColProps) {
  return (
    <Box w="inherit">
      <Box>{subText}</Box>
      <Box fontSize="20px" fontWeight={600}>
        {text}
      </Box>
    </Box>
  );
}

export default DiffTwoBlockCol;
