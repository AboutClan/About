import { Box, Flex, Progress } from "@chakra-ui/react";

interface ProgressMarkProps {
  value: number;
}

function ProgressMark({ value }: ProgressMarkProps) {
  return (
    <Box fontSize="8px" color="gray.800">
      {value !== 100 ? (
        <Flex w="100%" fontWeight="medium" color="gray.800">
          <Box ml="0">시작 점수</Box>
          <Box ml="auto">월간 최소 점수</Box>
        </Flex>
      ) : (
        <Box textAlign="end" color="var(--color-mint)">
          <i className="fa-light fa-hundred-points fa-xl" />
        </Box>
      )}

      <Flex w="100%" mt={1}>
        <Box ml="0" h="8px" borderLeft="1px solid var(--gray-200)" w="1px" />
        <Box ml="calc(50%)" h="8px" borderLeft="1px solid var(--gray-200)" w="1px" />
        <Box ml="auto" h="8px" borderRight="1.5px solid var(--gray-200)" w="1px"></Box>
      </Flex>
      <Progress h="8px" value={value} colorScheme="mint" />

      <Flex lineHeight="12px" fontSize="10px" mt="8px" color="gray.500" fontWeight="medium">
        <Box>0</Box>
        <Box ml="calc(50% - 7px)">5</Box>
        <Box ml="auto">10</Box>
      </Flex>
    </Box>
  );
}

export default ProgressMark;
