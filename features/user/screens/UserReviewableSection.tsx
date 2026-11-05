import { Badge, Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";

import { MainLoading } from "@/components/atoms/loaders/MainLoading";
import { useReviewableItems } from "@/features/user/hooks/useReviewableItems";

/** 아직 멤버 평가를 남기지 않은 번개·스터디를 작은 행으로 모아 보여준다 */
function UserReviewableSection() {
  const router = useRouter();
  const { items, isLoading } = useReviewableItems();

  if (isLoading) return <MainLoading />;

  return (
    <Box px={5}>
      <Box mb={3} fontSize="12px" lineHeight="18px" color="var(--gray-500)">
        최근 2주 안에 참여한 모임 중 아직 평가하지 않은 모임이에요. 서로 &lsquo;최고예요&rsquo;를
        누르면 자동으로 친구가 돼요.
      </Box>
      {items.length === 0 ? (
        <Flex
          justify="center"
          align="center"
          px={3}
          py={4}
          minH="114px"
          borderRadius="8px"
          bg="gray.100"
          border="var(--border)"
          fontSize="14px"
          fontWeight="medium"
          color="gray.600"
        >
          지금 평가할 수 있는 모임이 없어요
        </Flex>
      ) : (
        <Flex direction="column" border="var(--border)" borderRadius="8px" overflow="hidden">
          {items.map((item, idx) => (
            <Flex
              key={item.key}
              h="56px"
              px={3}
              align="center"
              borderTop={idx === 0 ? "none" : "var(--border)"}
              bg="white"
            >
              <Box w="36px" flexShrink={0} fontSize="12px" color="var(--gray-500)">
                {dayjs(item.date).format("MM.DD")}
              </Box>
              <Badge
                mr={2}
                flexShrink={0}
                size="lg"
                variant="subtle"
                colorScheme={item.type === "gather" ? "mint" : "blue"}
              >
                {item.type === "gather" ? "번개" : "스터디"}
              </Badge>
              <Box
                flex={1}
                minW={0}
                fontSize="13px"
                fontWeight="medium"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {item.title}
              </Box>
              <Button
                ml={2}
                size="xs"
                colorScheme="mint"
                flexShrink={0}
                onClick={() => router.push(item.url)}
              >
                평가하기
              </Button>
            </Flex>
          ))}
        </Flex>
      )}
    </Box>
  );
}

export default UserReviewableSection;
