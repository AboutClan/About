import { Box, Flex, Skeleton } from "@chakra-ui/react";

export function StudyThumbnailCardSkeleton({ hasBorder = true }: { hasBorder?: boolean }) {
  return (
    <Flex
      pb={hasBorder ? "12px" : "8px"}
      borderBottom={hasBorder ? "var(--border)" : "none"}
      justify="space-between"
    >
      {/* 이미지 자리 */}
      <Skeleton isLoaded={false} w="80px" h="80px" borderRadius="4px" flexShrink={0} />

      <Flex direction="column" ml={4} flex={1}>
        <Flex justify="space-between" align="flex-start">
          <Box>
            {/* 지점 자리 */}
            <Skeleton isLoaded={false} w="60px" h="10px" borderRadius="4px" mb={2} />
            {/* 타이틀 자리 */}
            <Skeleton isLoaded={false} w="110px" h="16px" borderRadius="4px" />
          </Box>
          {/* 배지 자리 */}
          <Skeleton isLoaded={false} w="40px" h="18px" borderRadius="4px" />
        </Flex>

        {/* 부제목 자리 */}
        <Skeleton isLoaded={false} w="80%" h="11px" borderRadius="4px" mt={2} />

        <Flex mt="auto" pt={2} align="center" justify="space-between">
          {/* 참여자 아바타 자리 */}
          <Flex>
            {[0, 1, 2, 3].map((idx) => (
              <Skeleton
                key={idx}
                isLoaded={false}
                w="24px"
                h="24px"
                borderRadius="full"
                ml={idx === 0 ? 0 : "-8px"}
                border="2px solid white"
              />
            ))}
          </Flex>
          {/* 인원/상태 텍스트 자리 */}
          <Skeleton isLoaded={false} w="50px" h="11px" borderRadius="4px" />
        </Flex>
      </Flex>
    </Flex>
  );
}
