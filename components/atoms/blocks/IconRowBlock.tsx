import { Box, Flex } from "@chakra-ui/react";

interface IconRowBlockProps {
  leftIcon: React.ReactNode;
  func?: () => void;
  mainText: string;
  subText: string;
}

function IconRowBlock({ leftIcon, func, mainText, subText }: IconRowBlockProps) {
  return (
    <Flex
      w="full"
      bg="gray.100"
      align="center"
      borderRadius="8px"
      border="var(--border)"
      py={3}
      px={4}
      onClick={func}
      as="button"
      textAlign="start"
    >
      <Flex justify="center" align="center" w="32px" h="32px" mr={3}>
        {leftIcon}
      </Flex>
      <Box>
        <Box mb={1} fontWeight="bold" color="gray.800" fontSize="13px" lineHeight="20px">
          {mainText}
        </Box>
        <Box color="gray.600" fontSize="11px" lineHeight="12px" fontWeight="medium">
          {subText}
        </Box>
      </Box>
    </Flex>
  );
}

export default IconRowBlock;
