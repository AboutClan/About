import { Box, Flex } from "@chakra-ui/react";

interface IconRowBlock2Props {
  text: string;
  time: string;

  rightChildren: React.ReactNode;
  leftChildren: React.ReactNode;
}

function IconRowBlock2({ text, time, rightChildren, leftChildren }: IconRowBlock2Props) {
  return (
    <Flex px={5} mt={5} justify="space-between" align="center">
      <Flex justify="center" align="center" mr={3}>
        {leftChildren}
      </Flex>
      <Box flex={1}>
        <Box mb={1} fontWeight="bold" fontSize="14px" lineHeight="20px">
          {text}
        </Box>
        <Box color="gray.500" fontSize="11px" lineHeight="12px">
          {time}
        </Box>
      </Box>
      <Box>{rightChildren}</Box>
    </Flex>
  );
}

export default IconRowBlock2;
