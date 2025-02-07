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
      bg="gray.100"
      align="center"
      borderRadius="8px"
      border="var(--border)"
      py={3}
      px={4}
      onClick={func}
    >
      <Flex justify="center" align="center" w="32px" h="32px" mr={2}>
        {leftIcon}
      </Flex>
      <Box>
        <Box mb={1} fontWeight="bold" color="gray.600" fontSize="13px" lineHeight="20px">
          {mainText}
        </Box>
        <Box color="gray.600" fontSize="12px" lineHeight="12px" fontWeight="medium">
          {subText}
        </Box>
      </Box>
    </Flex>
  );
}

export default IconRowBlock;
