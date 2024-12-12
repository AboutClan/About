import { Box, Flex, Skeleton } from "@chakra-ui/react";

function GatherSkeletonMain() {
  return (
    <Flex h="114px" p="8px" borderRadius="12px" border="1px solid var(--border)" bg="white">
      {/* 이미지 섹션 */}
      <Skeleton borderRadius="12px" w="98px" h="98px">
        <Box w="98px" h="98px" />
      </Skeleton>
      {/* 텍스트 섹션 */}
      <Flex mb="auto" ml="12px" w="full" direction="column" justify="space-between">
        {/* 상태와 카테고리 */}
        <Flex>
          <Skeleton w="40px" h="20px" borderRadius="4px" mr={2} />
          <Skeleton w="40px" h="20px" borderRadius="4px" />
        </Flex>
        {/* 타이틀 */}
        <Skeleton h="21px" w="70%" my="8px">
          <Box h="21px" />
        </Skeleton>
        {/* 날짜 및 장소 */}
        <Flex>
          <Skeleton h="16px" w="70%" mr="4px" />
        </Flex>
        {/* 참여자 섹션 */}
        <Flex justify="space-between" align="center" mt="4px" h={4}>
          {/* 아바타 그룹 */}

          <Skeleton w="40px" h={4} position="relative" />

          {/* 참여자 수 */}

          <Skeleton h={4} w="34px" />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default GatherSkeletonMain;
