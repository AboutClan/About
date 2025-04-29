import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

import Avatar from "../../components/atoms/Avatar";
import UserBadge from "../../components/atoms/badges/UserBadge";
import InfoCol, { InfoColOptions } from "../../components/atoms/InfoCol";
import InfoColSkeleton from "../../components/atoms/InfoColSkeleton";
import ProgressMark from "../../components/molecules/ProgressMark";
import { USER_ROLE } from "../../constants/settingValue/role";
import { usePointSystemLogQuery, useUserInfoQuery } from "../../hooks/user/queries";
import { IModal } from "../../types/components/modalTypes";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import { IFooterOptions, ModalLayout } from "../Modals";

function LastWeekAttendPopUp({ setIsModal }: IModal) {
  const router = useRouter();
  const { data: userInfo } = useUserInfoQuery();

  const { data } = usePointSystemLogQuery("score");
  const [isPenaltyModal, setIsPenaltyModal] = useState(false);

  const filteredData = data?.filter(
    (obj) =>
      dayjsToStr(dayjs(obj.timestamp).startOf("month")) === dayjsToStr(dayjs().startOf("month")),
  );

  const scoreObj = filteredData?.reduce(
    (acc, cur) => {
      const value = cur.meta.value;
      if (cur.message.includes("번개 모임 참여 취소")) {
        return { ...acc, gather: acc.gather - value };
      } else if (cur.message.includes("번개 모임 참여" || "번개 모임 개설")) {
        return { ...acc, gather: acc.gather + value };
      } else if (cur.message.includes("스터디 출석")) {
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
    sub: {
      text: "기록 보기",
      func: () => router.push("/user/score"),
    },
    isFull: true,
  };

  const monthScore = userInfo?.monthScore;

  const optionArr: InfoColOptions[] = [
    {
      left: "20점 이상",
      right: "열활멤버 추가 포인트",
    },
    {
      left: "10점 이상",
      right: "월간 참여 조건 충족",
    },
    {
      left: "5점 ~ 9점",
      right: "보증금 500원 차감",
    },
    {
      left: "2점 ~ 4점",
      right: "보증금 1000원 차감",
    },
    {
      left: "0점",
      right: "보증금 1000원 차감 및 활동 경고",
    },
  ];
  return (
    <>
      <ModalLayout
        title={`${dayjs().month() + 1}월 활동 점수표`}
        footerOptions={footerOptions}
        setIsModal={setIsModal}
      >
        <Flex align="center">
          <Avatar user={userInfo} size="xl1" />
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
          <ProgressMark value={userInfo?.monthScore} />
        </Box>

        {scoreObj ? (
          <InfoCol
            infoArr={[
              {
                left: "이번 달 스터디 점수",
                right: `${scoreObj.study} 점`,
              },
              {
                left: "이번 달 소모임 점수",
                right: `${scoreObj.group} 점`,
              },
              {
                left: "이번 달 번개 점수",
                right: `${scoreObj.gather} 점`,
              },
              {
                left: "기타 추가 점수",
                right: `${userInfo.monthScore - totalScore} 점`,
              },
            ]}
          />
        ) : (
          <InfoColSkeleton
            leftArr={[
              "이번 달 동아리 점수",
              "이번 달 스터디 점수",
              "이번 달 모임 점수",
              "이번 달에 받은 좋아요",
            ]}
          />
        )}
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
          mt={3}
          onClick={() => setIsPenaltyModal(true)}
        >
          동아리 활동 규정
        </Button>
        <Message>
          {totalScore >= 0 &&
            (dayjs(userInfo?.registerDate).diff(dayjs(), "month") === 0 ? (
              <div>
                🎉About에 오신 것을 진심으로 환영해요🎉
                <br />
                앞으로 같이 즐겁게 활동해봐요~!
              </div>
            ) : monthScore >= 20 ? (
              <Box>
                🏆 열정적인 활동가시군요! 🏆 <br />
                다음 정산 때 추가 포인트를 획득할 예정이에요.
                <br /> 앞으로도 멋진 활동 기대할게요! 💪✨
              </Box>
            ) : monthScore >= 10 ? (
              <div>
                🎉잘하고 있어요!!🎉
                <br />
                월간 목표 점수를 달성했습니다!
                <br /> 계속해서 좋은 활동 이어나가 봐요! 😊
              </div>
            ) : dayjs().date() <= 15 ? (
              <div>
                🍒이번 달도 파이팅🍒
                <br />
                이번 달 활동 점수 미리 미리 채우기!
              </div>
            ) : monthScore < 2 ? (
              <div>
                ⚠️ 활동 점수가 많이 부족합니다! ⚠️
                <br />
                월말 정산 때 벌금과 경고 조치가 있을 수 있으니,
                <br /> 꼭 활동에 미리 참여해 주시면 감사합니다!
              </div>
            ) : monthScore < 5 ? (
              <div>
                ⚠️ 활동 점수가 조금 부족해요! ⚠️
                <br />
                월말 정산 때 벌금이 발생할 수 있으니 <br /> 조금만 더 분발해 주세요!
              </div>
            ) : (
              <div>
                🍒 최소 활동 점수가 조금 부족해요. 🍒
                <br />
                월말 정산 시 벌금이 발생할 수 있으니,
                <br /> 조금만 더 파이팅 해봐요!
              </div>
            ))}
        </Message>
      </ModalLayout>
      {isPenaltyModal && (
        <ModalLayout title="동아리 활동 규정" footerOptions={{}} setIsModal={setIsPenaltyModal}>
          <InfoCol infoArr={optionArr} isMint isBig />
        </ModalLayout>
      )}
    </>
  );
}

const Message = styled.div`
  margin-top: 12px;
  padding: 12px 16px;
  min-height: 58px;
  border-radius: 8px;
  color: var(--gray-600);
  border: 1px solid var(--gray-100);
  font-size: 11px;
  font-weight: medium;
  background-color: var(--gray-100);
`;

export default LastWeekAttendPopUp;
