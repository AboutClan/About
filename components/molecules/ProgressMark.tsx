import { Box, Flex, Progress } from "@chakra-ui/react";

interface ProgressMarkProps {
  value: number;
}

function ProgressMark({ value }: ProgressMarkProps) {
  const isMax = value >= 30;

  return (
    <Box fontSize="12px">
      {!isMax ? (
        <Flex w="100%" color="var(--gray-500)">
          <Box w="22px" ml="calc(33% - 22px)" h="100%">
            경고
          </Box>
          <Box ml="auto">추가 점수</Box>
        </Flex>
      ) : (
        <Box textAlign="end" color="var(--color-mint)">
          <i className="fa-light fa-hundred-points fa-xl" />
        </Box>
      )}

      <Flex w="100%" h="12px">
        <Box
          ml="calc(33% - 0.75px)"
          h="100%"
          borderLeft="1.5px solid var(--gray-200)"
          w="1px"
        ></Box>
        <Box ml="auto" h="100%" borderRight="1.5px solid var(--gray-200)" w="1px"></Box>
      </Flex>
      <Progress value={(value * 100) / 30} hasStripe={true} colorScheme="mintTheme" />

      <Flex mt="4px" color="var(--gray-500)">
        <Box>0</Box>
        <Box ml="calc(33% - 22px)">10</Box>
        <Box ml="auto">30</Box>
      </Flex>
    </Box>
  );
}

export default ProgressMark;
