import { Box, Flex, Progress } from "@chakra-ui/react";

interface ProgressMarkProps {
  value: number;
}

function ProgressMark({ value }: ProgressMarkProps) {
  const isMax = value >= 30;

  return (
    <Box fontSize="8px" color="gray.800">
      {!isMax ? (
        <Flex w="100%" fontWeight="medium" color="gray.800">
          <Box ml="calc(33.3% - 28px)">최소 조건</Box>
          <Box ml="auto">추가 포인트</Box>
        </Flex>
      ) : (
        <Box textAlign="end" color="var(--color-mint)">
          <i className="fa-light fa-hundred-points fa-xl" />
        </Box>
      )}

      <Flex w="100%" mt={1}>
        <Box ml="0" h="8px" borderLeft="1px solid var(--gray-200)" w="1px" />
        <Box ml="calc(33.3%)" h="8px" borderLeft="1px solid var(--gray-200)" w="1px" />
        <Box ml="calc(33.3%)" h="8px" borderLeft="1px solid var(--gray-200)" w="1px" />
        <Box ml="auto" h="8px" borderRight="1.5px solid var(--gray-200)" w="1px"></Box>
      </Flex>
      <Progress h="8px" value={isMax ? 100 : (value * 100) / 30} colorScheme="mint" />

      <Flex lineHeight="12px" fontSize="10px" mt="8px" color="gray.500" fontWeight="medium">
        <Box>0</Box>
        <Box ml="calc(33.3% - 9px)">10</Box>
        <Box ml="calc(33.3% - 7px )">20</Box>
        <Box ml="auto">30</Box>
      </Flex>
    </Box>
  );
}

export default ProgressMark;
