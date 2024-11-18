import { Box, Flex, Skeleton } from "@chakra-ui/react";

interface InfoColSkeletonProps {
  leftArr: string[];
}

function InfoColSkeleton({ leftArr }: InfoColSkeletonProps) {
  return (
    <Flex direction="column" w="full">
      {leftArr.map((text, idx) => (
        <Flex key={idx} justify="space-between" fontSize="11px" my={1}>
          <Box color="gray.600">{text}</Box>
          <Box w="36px" h="20px">
            <Skeleton>1</Skeleton>
          </Box>
        </Flex>
      ))}
    </Flex>
  );
}

export default InfoColSkeleton;
