import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

import { useUserInfoQuery } from "@/features/user/hooks/queries";
import { BarRightIcon } from "@/features/user/screens/UserScoreBar";

/** 포인트 + 이번 달 최소 활동 여부. 게스트에게는 렌더하지 않는다(UserProfileSection에서 분기) */
function UserPointActivityBlock() {
  const { data: userInfo } = useUserInfoQuery();
  // 서버 월간 정산(resetPointByMonthScore)과 같은 기준: 이번 달 점수 1점 이상이면 만족
  const isMonthActive = (userInfo?.monthScore ?? 0) > 0;

  return (
    <Box mt={1} mx={5} p={4} borderRadius="16px" border="var(--border)" bgColor="white">
      <Flex as={Link} href="/user/log/point" align="center" m={-2} p={2} borderRadius="12px">
        <Flex
          justify="center"
          align="center"
          w="40px"
          h="40px"
          bg="rgba(0,194,179,0.08)"
          borderRadius="50%"
          flexShrink={0}
        >
          <Image src="/point.png" alt="point" width={26} height={26} />
        </Flex>
        <Box ml={3}>
          <Box fontSize="11px" fontWeight="medium" color="var(--gray-500)" lineHeight="14px">
            보유 포인트
          </Box>
          <Box fontSize="18px" fontWeight="bold" lineHeight="24px">
            {(userInfo?.point || 0).toLocaleString()}P
          </Box>
        </Box>
        <Flex ml="auto" align="center" h="14px">
          <BarRightIcon />
        </Flex>
      </Flex>

      {userInfo && !isMonthActive && (
        <Box
          mt={3}
          p={3}
          borderRadius="12px"
          bg="gray.50"
          fontSize="12px"
          lineHeight="18px"
          color="var(--gray-600)"
        >
          <Box as="b" color="var(--gray-800)">
            이번 달 최소 활동 만족이 필요해요!
          </Box>
          <br />
          월말까지 활동이 없으면{" "}
          <Box as="b" color="var(--color-red)">
            1,000 포인트
          </Box>
          가 차감될 수 있어요. 홈 화면에서{" "}
          <Box as="b" color="var(--color-mint)">
            출석체크
          </Box>{" "}
          버튼만 눌러도 충분해요!
        </Box>
      )}
    </Box>
  );
}

export default UserPointActivityBlock;
