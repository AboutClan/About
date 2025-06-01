import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import Avatar from "../../../components/atoms/Avatar";
import { PopOverIcon } from "../../../components/Icons/PopOverIcon";
import { useToast } from "../../../hooks/custom/CustomToast";
import { IUser } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

interface IProfileInfo {
  user: IUser;
}
function ProfileInfo({ user }: IProfileInfo) {
  const toast = useToast();
  const { data: session } = useSession();

  const getTemperatureColor = (temp: number, cnt: number): { color: string; bg: string } => {
    if (temp < 36.5 && cnt <= 2) return { color: "green.500", bg: "green.50" };
    if (temp <= 35.5) return { color: "gray.500", bg: "gray.50" };
    if (temp < 36.5) return { color: "blue.500", bg: "blue.50" };
    if (temp <= 38) return { color: "green.500", bg: "green.50" };
    if (temp <= 40) return { color: "orange.500", bg: "orange.50" };
    return { color: "red.500", bg: "red.50" };
  };

  const { color, bg } = getTemperatureColor(user?.temperature?.temperature, user?.temperature?.cnt);

  return (
    <>
      <Flex flexDir="column">
        <Flex align="center">
          <Avatar user={user} size="xl1" />
          <Flex ml={2} direction="column">
            <Flex>
              <Box mr={1} fontSize="16px" fontWeight="bold">
                {user?.name || session?.user.name}
              </Box>
            </Flex>
            <Box fontSize="12px" color="gray.500">
              {dayjsToFormat(dayjs(user?.registerDate), "YYYY년 M월 d일 가입") || "게스트"}
            </Box>
          </Flex>
          <Flex flexDir="column" ml="auto" mt={4} justify="center" align="center">
            <Button
              px={2.5}
              size="sm"
              fontSize="14px"
              bg={bg}
              color={color}
              lineHeight="22px"
              fontWeight={500}
              borderRadius="full"
              onClick={() => {
                toast("info", "상세 정보 확인은 준비중입니다.");
              }}
            >
              {`${
                user?.temperature?.temperature < 36.5 && user?.temperature?.cnt <= 2
                  ? "36.5"
                  : Number.isInteger(user?.temperature?.temperature)
                  ? `${user.temperature.temperature}.0`
                  : user?.temperature?.temperature || "36.5"
              }°C`}
            </Button>

            <Box mr={1.5}>
              <PopOverIcon
                marginDir="right"
                maxWidth={200}
                type="info"
                size="xs"
                rightText={`${user?.temperature?.cnt}명의 평가 반영`}
                text="소셜링 온도는 모임 종료 후 참여자들의 익명 리뷰를 바탕으로 산정되는 멤버 후기 지표입니다. 소셜링 온도가 높을수록 모임 승인률이 올라가고, 다양한 혜택을 받을 수 있습니다."
              />
            </Box>
          </Flex>
        </Flex>
        <Comment>{user?.comment}</Comment>
      </Flex>
    </>
  );
}

const Comment = styled.div`
  margin-left: var(--gap-1);
  margin-top: var(--gap-3);
  color: var(--gray-800);
  font-size: 12px;
`;

export default ProfileInfo;
