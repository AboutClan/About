import { Box, Button, Flex, Text } from "@chakra-ui/react";

import { IUserSummary, UserSimpleInfoProps } from "../../types/models/userTypes/userInfoTypes";
import { PopOverIcon } from "../Icons/PopOverIcon";

interface SocialingScoreBadgeProps {
  user: UserSimpleInfoProps | IUserSummary;
  size: "sm" | "md";
}

export const getTemperature = (user: UserSimpleInfoProps | IUserSummary) => {
  return `${
    user?.temperature?.temperature < 36.5 && user?.temperature?.cnt <= 2
      ? "36.5"
      : typeof user?.temperature?.temperature === "number"
      ? user.temperature.temperature.toFixed(1)
      : "36.5"
  }°C`;
};

export const getTemperatureColor = (temp: number, cnt: number): { color: string; bg: string } => {
  if (!temp || (temp < 36.5 && cnt <= 2)) return { color: "green.500", bg: "green.50" };
  if (temp <= 35.5) return { color: "gray.500", bg: "gray.50" };
  if (temp < 36.5) return { color: "blue.500", bg: "blue.50" };
  if (temp <= 38) return { color: "green.500", bg: "green.50" };
  if (temp <= 40) return { color: "mint.500", bg: "mint.50" };
  if (temp <= 43) return { color: "orange.500", bg: "orange.50" };
  return { color: "red.500", bg: "red.50" };
};

function SocialingScoreBadge({ user, size = "md" }: SocialingScoreBadgeProps) {
  const { color, bg } = getTemperatureColor(user?.temperature?.temperature, user?.temperature?.cnt);

  return (
    <Flex flexDir="column" mr={size === "sm" ? 1 : -1} justify="center" align="center">
      <Button
        as="div"
        w={size === "sm" ? "52px" : "60px"}
        size="sm"
        fontSize={size === "sm" ? "12px" : "14px"}
        bg={bg}
        color={color}
        lineHeight="22px"
        fontWeight={500}
        borderRadius="full"
        position="relative"
      >
        {getTemperature(user)}
        {size === "sm" && (
          <Flex
            w="18px"
            h="18px"
            position="absolute"
            top="-7px"
            right="-7px"
            fontSize="6px"
            color="var(--gray-500)"
            justify="center"
            alignItems="center"
            border="var(--border)"
            bg="gray.200"
            borderRadius="full"
            lineHeight="1"
          >
            <Text lineHeight="1" textAlign="center">
              {Math.round(user?.temperature?.cnt ?? 0)}명
            </Text>
          </Flex>
        )}
      </Button>
      {size === "md" && (
        <Box mr={1.5}>
          <PopOverIcon
            marginDir="right"
            maxWidth={200}
            type="info"
            size="xs"
            rightText={`${user?.temperature?.cnt || 0}명의 평가 반영`}
            text="소셜링 온도는 모임 종료 후 참여자들의 익명 리뷰를 바탕으로 산정되는 멤버 후기 지표입니다. 소셜링 온도가 높을수록 모임 승인률이 올라가고, 다양한 혜택을 받을 수 있습니다."
          />
        </Box>
      )}
    </Flex>
  );
}

export default SocialingScoreBadge;
