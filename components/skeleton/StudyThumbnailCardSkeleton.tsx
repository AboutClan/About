import { Box, Flex, Skeleton } from "@chakra-ui/react";

export function StudyThumbnailCardSkeleton() {
  return (
    <Box h="88px" mb={3} borderBottom="var(--border)">
      <Flex pr={3} bg="white" justify="space-between">
        {/* 이미지 자리 */}
        <Skeleton isLoaded={false} w="80px" h="80px" borderRadius="8px" />

        <Flex direction="column" ml={4} flex={1}>
          {/* 배지 자리 */}
          <Skeleton isLoaded={false} w="54px" h="12px" borderRadius="4px" mb={1} />

          {/* 타이틀 자리 */}
          <Skeleton isLoaded={false} w="100px" h="20px" borderRadius="4px" mb={1} />

          {/* 부제목 자리 */}
          <Skeleton isLoaded={false} w="100%" h="12px" />
        </Flex>
      </Flex>
    </Box>
  );
}
