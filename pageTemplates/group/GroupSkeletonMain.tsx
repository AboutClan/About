import { Box, Flex, Skeleton } from "@chakra-ui/react";

function GroupSkeletonMain({ isStudy = false }: { isStudy?: boolean }) {
  return (
    <Flex h="120px">
      <Skeleton mb="auto" borderRadius="4px">
        <Box w="96.6px" h="96.6px"></Box>
      </Skeleton>
      <Flex ml={3} w="full" direction="column">
        <Flex justify="space-between" mb={1} align="center" h={5}>
          <Skeleton w="70px" h={3}></Skeleton>
          <Skeleton w="56px" h={5} mr={1}></Skeleton>
        </Flex>
        <Skeleton h={6} w="140px" mb={1}></Skeleton>

        <Box my={1}>
          <Skeleton height="12px" width="100%" mb={1} />
          <Skeleton height="12px" width={isStudy ? "80%" : "40%"} />
        </Box>
        {!isStudy ? (
          <Flex justify="space-between" mt={3} py={0.5}>
            <Skeleton w={isStudy ? 0 : "52px"} h={3}></Skeleton>
            <Skeleton w={isStudy ? "120px" : "36px"} h={3}></Skeleton>
          </Flex>
        ) : null}
      </Flex>
    </Flex>
  );
}

export default GroupSkeletonMain;
