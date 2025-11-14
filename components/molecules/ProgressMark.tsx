import { Box, Flex, Progress } from "@chakra-ui/react";

interface ProgressMarkProps {
  value: number;
}

function ProgressMark({ value }: ProgressMarkProps) {
  const type = value < 10 ? "first" : value < 20 ? "second" : "third";

  return (
    <Box fontSize="8px" color="gray.800">
      <Flex w="100%" fontWeight="medium" color="gray.800">
        {type === "first" ? (
          <Box ml="0" color="mint">
            현재 {value}점
          </Box>
        ) : type === "second" ? (
          <Box ml="calc(50% - 21px)" color="gray.800">
            월간 최소 점수
          </Box>
        ) : null}
        <Box ml="auto" color={type === "first" ? "inherit" : "mint"}>
          {type === "first"
            ? "월간 목표 점수"
            : type === "second"
            ? "다음 목표 점수"
            : `현재 ${value}점 달성`}
        </Box>
      </Flex>
      <Flex w="100%" mt={1}>
        <Box ml="0" h="8px" borderLeft="1px solid var(--gray-200)" w="1px" />
        <Box ml="calc(50%)" h="8px" borderLeft="1px solid var(--gray-200)" w="1px" />
        <Box ml="auto" h="8px" borderRight="1.5px solid var(--gray-200)" w="1px"></Box>
      </Flex>
      <Progress h="8px" value={value * (type === "first" ? 10 : 5)} colorScheme="mint" />

      <Flex lineHeight="12px" fontSize="10px" mt="4px" color="gray.500" fontWeight="medium">
        <Box>0</Box>
        <Box ml="calc(50% - 7px)">{type === "first" ? 5 : 10}</Box>
        <Box ml="auto">{type === "first" ? 10 : 20}</Box>
      </Flex>
    </Box>
  );
}

export default ProgressMark;
