import { Box, Button, Flex } from "@chakra-ui/react";

import { CheckCircleIcon20 } from "../Icons/CircleIcons";

interface TextCheckButtonProps {
  text: string;
  isChecked: boolean;
  toggleCheck: () => void;
  buttonText?: string;
  handleBtn?: () => void;
}

function TextCheckButton({
  text,
  isChecked,
  toggleCheck,
  buttonText,
  handleBtn,
}: TextCheckButtonProps) {
  return (
    <Flex
      onClick={toggleCheck}
      as="button"
      border="var(--border)"
      borderRadius="16px"
      boxShadow="0px 2px 12px rgba(0, 0, 0, 0.04)"
      px={4}
      py={3}
      justify="space-between"
      w="full"
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
        ml={2}
        flex={1}
        my="auto"
      >
        {text}
      </Box>
      {buttonText ? (
        <Button
          as="div"
          borderRadius="8px"
          px={4}
          size="sm"
          variant="subtle"
          colorScheme="mint"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleBtn();
          }}
        >
          {buttonText}
        </Button>
      ) : (
        <Button
          as="div"
          borderRadius="8px"
          px={4}
          size="sm"
          bg={isChecked ? "mint" : "gray.400"}
          color="white"
        >
          확 인
        </Button>
      )}
    </Flex>
  );
}

export default TextCheckButton;
