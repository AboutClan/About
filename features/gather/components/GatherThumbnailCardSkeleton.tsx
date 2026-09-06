import { Box, Flex, Skeleton } from "@chakra-ui/react";

export function GatherThumbnailCardSkeleton() {
  return (
    <Box p={2} pr={4} mb={3} h="114px" border="var(--border)" borderRadius="8px" bg="white">
      <Flex justify="space-between">
        {/* Image placeholder */}
        <Skeleton w="98px" h="98px" borderRadius="8px" />

        <Flex direction="column" ml={3} flex={1}>
          {/* Badges placeholder */}
          <Flex mb={2}>
            <Skeleton w="40px" h="20px" borderRadius="4px" mr={1} />
            <Skeleton w="40px" h="20px" borderRadius="4px" />
          </Flex>

          {/* Title placeholder */}
          <Skeleton w="150px" h="20px" mb={2} />

          {/* Subtitle placeholder */}
          <Skeleton w="110px" h="16px" mb={1} />

          {/* Avatar and User Count placeholder */}
          <Flex justify="space-between" alignItems="center">
            <Skeleton w="60px" h="16px" />
            <Skeleton w="40px" h="16px" />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
