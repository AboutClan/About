import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import Avatar from "../../../components/atoms/Avatar";
import UserBadge from "../../../components/atoms/badges/UserBadge";
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
              <Box>
                <UserBadge badgeIdx={user?.badge?.badgeIdx} />
              </Box>
            </Flex>
            <Box fontSize="12px" color="gray.500">
              {dayjsToFormat(dayjs(user?.registerDate), "YYYY년 M월 d일 가입") || "게스트"}
            </Box>
          </Flex>
          <Flex flexDir="column" ml="auto" mt={4} align="center">
            {user && user?.uid !== session?.user?.uid && (
              <Button
                ml={2}
                px={2.5}
                size="sm"
                fontSize="14px"
                bg="green.50"
                color="green.500"
                lineHeight="22px"
                fontWeight={500}
                borderRadius="full"
                onClick={() => {
                  toast("info", "아직 해당 멤버의 집계된 데이터가 없습니다.");
                }}
              >
                36.5°C
              </Button>
            )}
            <PopOverIcon
              size="xs"
              marginDir="right"
              maxWidth={200}
              rightText="소셜링 온도란?"
              text="소셜링 온도는 그 사람의 모임 후기를 알 수 있는 지표예요. 소셜링 온도는 매월 1일에, 전전 달 15일부터 전 달 15일까지의 평가가 한 번에 반영됩니다."
            />
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
