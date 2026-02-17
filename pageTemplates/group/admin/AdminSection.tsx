import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";

import Avatar from "../../../components/atoms/Avatar";
import { ShortArrowIcon } from "../../../components/Icons/ArrowIcons";
import { CrownIcon } from "../../../components/Icons/icons";
import MiniSemiGaugeNeedle from "../../../components/molecules/GradeGauge";
import { GROUP_STUDY } from "../../../constants/keys/queryKeys";
import { useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { useUserInfo } from "../../../hooks/custom/UserHooks";
import {
  useGroupMemberRoleMutation,
  useGroupRandomTicketMutation,
} from "../../../hooks/groupStudy/mutations";
import {
  GradeProps,
  useGroupIdMannerQuery,
  useGroupsMemberActivityQuery,
} from "../../../hooks/groupStudy/queries";
import { useUserRandomTicketMutation } from "../../../hooks/user/mutations";
import { IFooterOptions, ModalLayout } from "../../../modals/Modals";
import { calculateGrade } from "../../../pages/group/[id]/manner";
import { DispatchType } from "../../../types/hooks/reactTypes";
import { GroupParicipantProps } from "../../../types/models/groupTypes/group";

const pillProps = {
  variant: "outline" as const,
  borderRadius: "full",
  h: "36px",
  px: 4,
  fontSize: "12px",
  fontWeight: 800,
  borderColor: "gray.200",
  bg: "white",
  _hover: { bg: "gray.50" },
  _active: { bg: "gray.100" },
};

interface AdminSectionProps {
  groupId: string;
  users: GroupParicipantProps[];
  randomTicket: number;
}

export interface SelectMemberProps {
  type: "member" | "ticket" | null;
  userId: string;
}

export function AdminSection({ groupId, users, randomTicket }: AdminSectionProps) {
  const toast = useToast();
  const typeToast = useTypeToast();
  const queryClient = useQueryClient();

  const { data } = useGroupIdMannerQuery(groupId, null, { enabled: !!groupId });
  const { data: activityData } = useGroupsMemberActivityQuery(groupId, "this", {
    enabled: !!groupId,
  });

  const { mutate: changeRole, isLoading: isLoading1 } = useGroupMemberRoleMutation(+groupId, {
    onSuccess() {
      queryClient.invalidateQueries([GROUP_STUDY]);
      typeToast("change");
      setSelectMember(null);
    },
  });
  const { mutate: updateGroupTicket, isLoading: isLoading2 } =
    useGroupRandomTicketMutation(groupId);
  const { mutate: updateUserTicket, isLoading: isLoading3 } = useUserRandomTicketMutation();

  const [selectMember, setSelectMember] = useState<SelectMemberProps>();

  const isLoading = isLoading1! || isLoading2 || isLoading3;

  const findSelectMember = users?.find((user) => user?.user._id === selectMember?.userId);

  const footerOptions: IFooterOptions = {
    main: {
      text: selectMember?.type === "member" ? "전 환" : "부 여",
      func: async () => {
        if (selectMember?.type === "member") {
          changeRole({
            userId: selectMember?.userId,
            role: findSelectMember?.role === "regularMember" ? "member" : "regularMember",
          });
        } else {
          await Promise.all([
            updateGroupTicket(),
            updateUserTicket({
              userId: selectMember?.userId,
              number: 1,
            }),
          ]);
          queryClient.invalidateQueries([GROUP_STUDY]);
          setSelectMember(null);
          toast("success", "전송 완료");
        }
      },
      isLoading: isLoading,
    },
    sub: {
      text: "취 소",
    },
  };

  return (
    <>
      <Filter />
      <Flex flexDir="column">
        {users?.map((who, idx) => (
          <Box key={idx}>
            <UserBlock
              who={who}
              data={data}
              activityData={activityData}
              setSelectMember={setSelectMember}
              isLoading={isLoading}
            />
          </Box>
        ))}
      </Flex>
      {selectMember && (
        <ModalLayout
          title={selectMember.type === "member" ? "멤버 전환" : "열활 티켓 부여"}
          setIsModal={() => setSelectMember(null)}
          footerOptions={footerOptions}
        >
          <Box as="p">
            {selectMember.type === "member" ? (
              <>
                {findSelectMember?.user.name}님의 등급을{" "}
                <b>[{findSelectMember?.role === "member" ? "정규 멤버" : "임시 멤버"}]</b>로
                전환합니다.
              </>
            ) : (
              <>
                {findSelectMember?.user.name}님에게 <b>[열활 티켓 1장]</b>을 부여합니다.
                <Box color="gray.600" mt={1}>
                  이번 달 남은 횟수: {25 - randomTicket} 회
                </Box>
              </>
            )}
          </Box>
        </ModalLayout>
      )}
    </>
  );
}

function UserBlock({
  who,
  data,
  activityData,
  setSelectMember,
  isLoading,
}: {
  who: GroupParicipantProps;
  data: GradeProps[];
  activityData: {
    user: string;
    monthGatherCount: number;
    totalGatherCount: number;
  }[];
  setSelectMember: DispatchType<SelectMemberProps>;
  isLoading: boolean;
}) {
  const userInfo = useUserInfo();

  const grade =
    data &&
    (data[who.user.uid] as {
      great: number;
      good: number;
      soso: number;
      block: number;
    });
  const { total, value } = calculateGrade(grade);

  const role = who?.role;

  const findWho = activityData?.find((who2) => who2?.user === who?.user?._id);
  const gatherCount = {
    gatherCount: findWho?.monthGatherCount,
    totalCount: findWho?.totalGatherCount,
  };

  function Divider() {
    return <Box w="1px" h="40px" bg="gray.200" />;
  }
  return (
    <>
      <Flex flexDir="column" borderBottom="var(--border)" pb={3}>
        <Flex py={2.5} align="center">
          <Avatar user={who.user} size="md1" />
          <Flex direction="column" flex={0.95} justify="center" ml={3} my={1}>
            <Flex align="center" mb={1}>
              <Box lineHeight="20px" mr={1} fontWeight="semibold" fontSize="13px">
                {who.user.name}
              </Box>
              <Badge
                h="20px"
                variant="subtle"
                px={2}
                py={1}
                lineHeight="12px"
                fontWeight="semibold"
                fontSize="9px"
                borderRadius="10px"
                colorScheme={role === "member" ? "blue" : "green"}
              >
                {role === "member" ? "임시 멤버" : "정규 멤버"}
              </Badge>

              {(role === "admin" || role === "manager") && (
                <Flex justify="center" align="center" ml={1}>
                  <CrownIcon color={role === "admin" ? "yellow" : "gray"} />
                </Flex>
              )}
            </Flex>
            <Flex lineHeight="18px" alignItems="center" color="gray.500" fontSize="12px">
              <CommentText>2026년 2월 17일 가입</CommentText>
            </Flex>
          </Flex>
          <Flex align="center" ml="auto">
            <Button
              isDisabled={who.user?.uid === userInfo.uid}
              onClick={() => setSelectMember({ type: "member", userId: who.user._id })}
              colorScheme="mint"
              size="sm"
              ml={3}
              variant="subtle"
              isLoading={isLoading}
            >
              멤버 전환
            </Button>
            <Button
              isDisabled={who.user?.uid === userInfo.uid}
              onClick={() => setSelectMember({ type: "ticket", userId: who.user._id })}
              colorScheme="red"
              variant="subtle"
              size="sm"
              ml={3}
              isLoading={isLoading}
            >
              열활 티켓 부여
            </Button>
          </Flex>
        </Flex>{" "}
        <Box
          borderRadius="xl"
          overflow="hidden"
          bg="gray.50"
          border="1px solid"
          borderColor="gray.100"
        >
          {/* Top */}
          <Flex px={3} py={2} lineHeight="18px" bg="gray.50">
            <ClockIcon />
            <Text fontSize="12px" ml={2} color="gray.700">
              활동중 (경고 없음)
            </Text>
          </Flex>

          {/* Bottom stats */}
          <Flex bg="white" borderTop="1px solid" borderColor="gray.100" alignItems="center">
            <Flex direction="column" align="center" justify="center" flex="1" py={3}>
              <Text fontSize="13px" color="gray.600">
                이번 달 참여
              </Text>
              <Text mt={2} fontSize="14px" color="gray.700" fontWeight="600" lineHeight="1">
                {gatherCount?.gatherCount ? "○" : "X"}
              </Text>
            </Flex>
            <Divider />
            <Flex direction="column" align="center" justify="center" flex="1" py={3}>
              <Text fontSize="13px" color="gray.600">
                누적 참여
              </Text>
              <Text mt={2} fontSize="14px" color="gray.700" fontWeight="600" lineHeight="1">
                {`${gatherCount?.totalCount} 회`}
              </Text>
            </Flex>
            <Divider />
            <Flex direction="column" align="center" justify="center" flex="1" py={3}>
              <Box>
                <MiniSemiGaugeNeedle value={value} label={total + ""} />
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </>
  );
}

function Filter() {
  return (
    <Box bg="white" px={0} mt={5} mb={3}>
      <HStack
        flexWrap="nowrap"
        spacing={2}
        align="center"
        overflowX="auto"
        sx={{
          "::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          touchAction: "auto",
          "& *": {
            touchAction: "auto", // ← 자식들까지 다 풀어버리기
          },
        }}
      >
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ShortArrowIcon dir="bottom" />}
            {...pillProps}
            pr={3}
            flexShrink={0}
          >
            최근 가입 순
          </MenuButton>
          <MenuList borderRadius="xl" py={2}>
            <MenuItem>최근 가입 순</MenuItem>
            <MenuItem>오래된 가입 순</MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ShortArrowIcon dir="bottom" />}
            pr={3}
            {...pillProps}
            flexShrink={0}
          >
            멤버 등급
          </MenuButton>
          <MenuList borderRadius="xl" py={2}>
            <MenuItem>전체</MenuItem>
            <MenuItem>운영진</MenuItem>
            <MenuItem>정규 멤버</MenuItem>
            <MenuItem>임시 멤버</MenuItem>
          </MenuList>
        </Menu>
        <Button {...pillProps} flexShrink={0}>
          상세 기록
        </Button>
        <Button {...pillProps} flexShrink={0}>
          메모
        </Button>
      </HStack>
    </Box>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--gray-500)"
    >
      <path d="M520-496v-144q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v159q0 8 3 15.5t9 13.5l132 132q11 11 28 11t28-11q11-11 11-28t-11-28L520-496ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
    </svg>
  );
}

const CommentText = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  color: var(--gray-500);
  font-size: 12px;
  line-height: 18px;
`;
