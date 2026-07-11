import { Box, Flex } from "@chakra-ui/react";

import Avatar from "../../components/atoms/Avatar";
import { getTemperatureColor } from "../../components/molecules/SocialingScoreBadge";
import { useUserReviewQuery } from "../../hooks/user/queries";
import { IUser } from "../../types/models/userTypes/userInfoTypes";

interface UserReviewBarProps {
  user: IUser;
  hasTop?: boolean;
  isCafeMap?: boolean;
}

function UserReviewBar({ user, hasTop = true, isCafeMap }: UserReviewBarProps) {
  const { data: reviewArr } = useUserReviewQuery(user?.uid, {
    enabled: !!user?.uid,
  });

  const totalCnt = reviewArr?.totalCnt;

  const calculatePercent = (cnt: number) => {
    if (!cnt) return 0;
    return Math.round((cnt / totalCnt) * 100);
  };

  return (
    <>
      <Box mx={5} mb={3} mt={hasTop ? 5 : 1}>
        <Box>
          <Flex align="center">
            <Box mr="auto" color="var(--gray-800)" fontSize="16px" fontWeight={600}>
              <Flex align="center">
                <Box>소셜링 온도</Box>
                <Box
                  ml={1}
                  fontWeight={600}
                  fontSize="14px"
                  lineHeight={1}
                  color={getTemperatureColor(user?.temperature?.temperature, null)?.color}
                >
                  {user?.temperature?.temperature}°C
                </Box>
              </Flex>
              <Box fontSize="10px" color="gray.400" fontWeight={400}>
                {isCafeMap
                  ? "스터디 오픈 이후부터 사용할 수 있어요!"
                  : `멤버 평가 ${Math.round(Math.round(user?.temperature?.cnt))}회 반영`}
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>
      <Flex mx={5} fontSize="13px" gap={5} pb={1.5} color="gray.600">
        <Flex align="center" flex={1}>
          <Avatar user={{ avatar: { type: 20, bg: 1 } }} size="xs1" />
          <Box ml={2} mr={1}>
            최고예요 😘
          </Box>
          <Box fontWeight="600">{calculatePercent(reviewArr?.greatCnt)}%</Box>
        </Flex>
        <Flex align="center" flex={1}>
          <Avatar user={{ avatar: { type: 11, bg: 6 } }} size="xs1" />
          <Box ml={2} mr={1}>
            좋아요 😉
          </Box>
          <Box fontWeight="600">{calculatePercent(reviewArr?.goodCnt)}%</Box>
        </Flex>
      </Flex>
    </>
  );
}

export default UserReviewBar;
