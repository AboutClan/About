import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import { USER_ROLE } from "../../constants/settingValue/role";
import { usePointSystemLogQuery, useUserInfoQuery } from "../../hooks/user/queries";
import { IFooterOptions, ModalLayout } from "../../modals/Modals";
import { CloseProps } from "../../types/components/modalTypes";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import Avatar from "../atoms/Avatar";
import UserBadge from "../atoms/badges/UserBadge";
import InfoCol, { InfoColOptions } from "../atoms/InfoCol";
import ProgressMark from "../molecules/ProgressMark";
import ValueBoxCol, { ValueBoxColItemProps } from "../molecules/ValueBoxCol";

function MonthlyScoreModal({ onClose }: CloseProps) {
  const { data: userInfo } = useUserInfoQuery();

  const { data } = usePointSystemLogQuery("score", "all");
  const [isPenaltyModal, setIsPenaltyModal] = useState(false);
  console.log(24, data);
  const filteredData = data?.filter(
    (obj) =>
      dayjsToStr(dayjs(obj.timestamp).startOf("month")) === dayjsToStr(dayjs().startOf("month")),
  );

  const scoreObj = filteredData?.reduce(
    (acc, cur) => {
      const value = cur.meta.value;
      if (cur.message.includes("번개 모임 참여 취소")) {
        return { ...acc, gather: acc.gather - value };
      } else if (cur.message.includes("번개 모임 참여") || cur.message.includes("번개 모임 개설")) {
        return { ...acc, gather: acc.gather + value };
      } else if (cur.message.includes("스터디")) {
        return { ...acc, study: acc.study + value };
      } else if (cur.message.includes("소모임 주간 출석")) {
        return { ...acc, study: acc.group + value };
      }
      return acc;
    },
    { study: 0, gather: 0, group: 0 },
  );

  const totalScore = scoreObj?.study + scoreObj?.gather + scoreObj?.group;

  const footerOptions: IFooterOptions = {
    main: {},
    isFull: true,
  };

  const optionArr: InfoColOptions[] = [
    {
      left: "번개 모임 개설",
      right: "+ 10점",
    },
    {
      left: "번개 모임 참여",
      right: "+ 5점",
    },
    {
      left: "사전 스터디 투표",
      right: "+ 3점",
    },
    {
      left: "공식 스터디 출석",
      right: "+ 5점",
    },
    {
      left: "개인 스터디 출석",
      right: "+ 2점",
    },
    {
      left: "소모임 주간 출석",
      right: "+ 2점",
    },
  ];

  const valueArr: ValueBoxColItemProps[] = scoreObj && [
    {
      left: "이번 달 스터디 점수",
      right: `${scoreObj.study} 점`,
    },
    {
      left: "이번 달 모임 점수",
      right: `${scoreObj.group + scoreObj.gather} 점`,
    },
    {
      left: "기타 추가 점수",
      right: `${userInfo.monthScore - totalScore} 점`,
    },
    {
      left: "최종 월간 점수",
      right: `= ${userInfo.monthScore} 점`,
      isFinal: true,
    },
  ];
  return (
    <>
      <ModalLayout
        title={`${dayjs().month() + 1}월 활동 점수표`}
        footerOptions={footerOptions}
        setIsModal={onClose}
      >
        <Box minH="318px">
          <Flex align="center">
            <Avatar user={userInfo} size="md1" />
            <Box
              ml={2}
              lineHeight="16px"
              fontSize="12px"
              fontWeight="semibold"
              color="var(--gray-800)"
            >
              {userInfo?.name} ({USER_ROLE?.[userInfo?.role]})
            </Box>
            <Box ml="auto">
              <UserBadge badgeIdx={userInfo?.badge?.badgeIdx} />
            </Box>
          </Flex>
          <Box my={3} h="1px" bg="gray.100" />

          <Box mb={3}>
            <ProgressMark value={(userInfo?.monthScore / 30) * 100} />
          </Box>
          <Box minH="130px">{scoreObj && <ValueBoxCol items={valueArr} />}</Box>
          <Button
            variant="unstyled"
            bg="gray.800"
            borderRadius="20px"
            color="white"
            px={3}
            fontSize="10px"
            mx="auto"
            py={2}
            w="max-content"
            mt={5}
            onClick={() => setIsPenaltyModal(true)}
          >
            월간 점수 가이드
          </Button>
        </Box>
      </ModalLayout>
      {isPenaltyModal && (
        <ModalLayout title="동아리 활동 규정" footerOptions={{}} setIsModal={setIsPenaltyModal}>
          <InfoCol infoArr={optionArr} isMint isBig />
        </ModalLayout>
      )}
    </>
  );
}

export default MonthlyScoreModal;
