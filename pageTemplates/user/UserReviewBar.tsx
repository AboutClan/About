import { Box, Flex } from "@chakra-ui/react";

import Avatar from "../../components/atoms/Avatar";
import { getTemperatureColor } from "../../components/molecules/SocialingScoreBadge";
import { useUserReviewQuery } from "../../hooks/user/queries";
import { IUser } from "../../types/models/userTypes/userInfoTypes";

interface UserReviewBarProps {
  user: IUser;
}

function UserReviewBar({ user }: UserReviewBarProps) {
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
      <Box mx={5} my={3} mt={5}>
        <Box>
          <Flex align="center">
            <Box mr="auto" color="var(--gray-800)" fontSize="16px" fontWeight={600}>
              소셜링 온도
              <Box
                ml={0.5}
                as="b"
                fontSize="13px"
                color={getTemperatureColor(user?.temperature?.temperature, null)?.color}
              >
                {user?.temperature?.temperature}°C
              </Box>
              <Box fontSize="10px" color="gray.400" fontWeight={400}>
                멤버 평가 {user?.temperature?.cnt}회 반영
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>
      <Flex mx={5} fontSize="13px" gap={5} color="gray.600">
        <Flex align="center" flex={1}>
          <Avatar user={{ avatar: { type: 20, bg: 1 } }} size="xs1" />
          <Box ml={2} mr={1}>
            최고예요 😘
          </Box>
          <Box fontWeight="bold">{calculatePercent(reviewArr?.greatCnt)}%</Box>
        </Flex>
        <Flex align="center" flex={1}>
          <Avatar user={{ avatar: { type: 11, bg: 6 } }} size="xs1" />
          <Box ml={2} mr={1}>
            좋아요 😉
          </Box>
          <Box fontWeight="bold">{calculatePercent(reviewArr?.goodCnt)}%</Box>
        </Flex>
      </Flex>
    </>
  );
}

export default UserReviewBar;
