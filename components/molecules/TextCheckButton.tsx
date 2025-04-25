import { Box, Button, Flex } from "@chakra-ui/react";

import { CheckCircleIcon20 } from "../Icons/CircleIcons";

interface TextCheckButtonProps {
  text: string;
  isChecked: boolean;
  toggleCheck: () => void;
}

function TextCheckButton({ text, isChecked, toggleCheck }: TextCheckButtonProps) {
  return (
    <Flex
      onClick={toggleCheck}
      as="button"
      border="1px solid var(--gray-100)"
      borderRadius="16px"
      px={4}
      py={3}
      justify="space-between"
    >
      <Box my="auto">
        <CheckCircleIcon20 color={isChecked ? "mint" : "gray"} />
      </Box>
      <Box
        lineHeight="20px"
        fontWeight="semibold"
        color="gray.900"
        fontSize="13px"
        textAlign="start"
        ml={1}
        flex={1}
        my="auto"
      >
        {text}
      </Box>
      <Button
        as="div"
        borderRadius="8px"
        w="54px"
        size="sm"
        bg={isChecked ? "mint" : "gray.400"}
        color="white"
      >
        확 인
      </Button>
    </Flex>
  );
}

export default TextCheckButton;
