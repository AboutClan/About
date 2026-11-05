import { Box, Flex } from "@chakra-ui/react";
import Link from "next/link";

import Avatar from "@/components/atoms/Avatar";
import { useUidsToUsersInfoQuery, useUserInfoQuery } from "@/features/user/hooks/queries";
import { BarRightIcon } from "@/features/user/screens/UserScoreBar";

/** 서로 '최고예요'를 눌러 자동 등록된 친구 목록(작은 프로필). 게스트에게는 렌더하지 않는다 */
function UserFriendBlock() {
  const { data: userInfo } = useUserInfoQuery();
  const friendUids = userInfo?.friend ?? [];
  const { data: friends } = useUidsToUsersInfoQuery(friendUids, {
    enabled: friendUids.length > 0,
  });

  return (
    <Box mx={5} mt={4} mb={3}>
      {/* 제목·부제는 UserReviewBar(소셜링 온도)와 같은 크기 */}
      <Flex align="center">
        <Box mr="auto" color="var(--gray-800)" fontSize="16px" fontWeight={600}>
          <Box>친구 목록</Box>
          <Box fontSize="11px" color="gray.400" fontWeight={400}>
            멤버 평가에서 서로 &lsquo;최고예요&rsquo;를 주면 자동으로 친구가 돼요
          </Box>
        </Box>
        <Link href="/user/friend">
          <Flex align="center" fontSize="13px" color="gray.600">
            <Box as="b" color="var(--color-mint)">
              {friendUids.length}명
            </Box>
            <Flex ml={0.5} align="center" h="14px">
              <BarRightIcon />
            </Flex>
          </Flex>
        </Link>
      </Flex>

      {friendUids.length === 0 ? (
        <Flex
          as={Link}
          href="/user/review"
          mt={3}
          justify="space-between"
          align="center"
          fontSize="13px"
          bg="gray.50"
          px={4}
          py={3}
          borderRadius="16px"
          color="gray.600"
          border="var(--border)"
        >
          아직 친구가 없어요
          <Flex align="center" fontWeight="semibold" color="var(--color-mint)">
            멤버 평가하러 가기
            <Flex ml={0.5} align="center" h="14px">
              <BarRightIcon />
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <Flex
          mt={3}
          gap={3}
          overflowX="auto"
          sx={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
        >
          {(friends ?? []).map((friend) => (
            <Flex key={friend.uid} direction="column" align="center" w="48px" flexShrink={0}>
              <Avatar user={friend} size="sm1" />
              <Box
                mt={1}
                w="full"
                fontSize="11px"
                lineHeight="16px"
                color="gray.600"
                textAlign="center"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {friend.name}
              </Box>
            </Flex>
          ))}
        </Flex>
      )}
    </Box>
  );
}

export default UserFriendBlock;
