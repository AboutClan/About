import { Box, Button, Flex } from "@chakra-ui/react";

import Avatar from "../../components/atoms/Avatar";
import { getTemperatureColor } from "../../components/molecules/SocialingScoreBadge";
import { useUserReviewQuery } from "../../hooks/user/queries";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { BarRightIcon } from "./UserScoreBar";

interface UserReviewBarProps {
  user: IUser;
  handleButton?: () => void;
}

function UserReviewBar({ user, handleButton }: UserReviewBarProps) {
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
      {handleButton && (
        <Flex mt={2} mx={5}>
          <Button
            pt={0.5}
            pb={1.5}
            px={2}
            variant="unstyled"
            color="var(--color-gray)"
            ml="auto"
            border="none"
            w="max-content"
            fontSize="10px"
            lineHeight="14px"
            rightIcon={
              <Flex
                transform="translateY(2.7px)"
                alignItems="center"
                justifyContent="center"
                h="14px"
              >
                <BarRightIcon />
              </Flex>
            }
            iconSpacing={0.5}
            onClick={() => {
              handleButton();
            }}
          >
            소셜링 온도 혜택
          </Button>
        </Flex>
      )}
    </>
  );
}

export default UserReviewBar;
