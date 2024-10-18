import { Box, Flex, Progress } from "@chakra-ui/react";

interface ProgressMarkProps {
  value: number;
}

function ProgressMark({ value = 20 }: ProgressMarkProps) {
  const isMax = value >= 30;
  console.log(54, value);
  return (
    <Box fontSize="8px" color="gray.800">
      {!isMax ? (
        <Flex w="100%" fontWeight="medium" color="gray.800">
          <Box ml="calc(33.3% - 14px)">경고</Box>

          <Box ml="auto">추가 점수</Box>
        </Flex>
      ) : (
        <Box textAlign="end" color="var(--color-mint)">
          <i className="fa-light fa-hundred-points fa-xl" />
        </Box>
      )}

      <Flex w="100%" mt={1}>
        <Box ml="calc(33.3%)" h="8px" borderLeft="1px solid var(--gray-200)" w="1px" />
        <Box ml="calc(33.3%)" h="8px" borderLeft="1px solid var(--gray-200)" w="1px" />
        <Box ml="auto" h="8px" borderRight="1.5px solid var(--gray-200)" w="1px"></Box>
      </Flex>
      <Progress h="8px" value={isMax ? 100 : (value * 100) / 30} colorScheme="mint" />

      <Flex mt="4px" color="gray.500" fontWeight="medium">
        <Box>0</Box>
        <Box ml="calc(33.3% - 9px)">10</Box>
        <Box ml="calc(33.3% - 7px )">20</Box>
        <Box ml="auto">30</Box>
      </Flex>
    </Box>
  );
}

export default ProgressMark;
