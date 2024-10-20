import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import Avatar from "../../components/atoms/Avatar";
import UserBadge from "../../components/atoms/badges/UserBadge";
import Skeleton from "../../components/atoms/skeleton/Skeleton";
import ProgressMark from "../../components/molecules/ProgressMark";
import { USER_ROLE } from "../../constants/settingValue/role";
import { usePointSystemLogQuery, useUserInfoQuery } from "../../hooks/user/queries";
import { useNoticeActiveLogQuery } from "../../hooks/user/sub/interaction/queries";
import { IModal } from "../../types/components/modalTypes";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import { IFooterOptions, ModalLayout } from "../Modals";

function LastWeekAttendPopUp({ setIsModal }: IModal) {
  const router = useRouter();
  const { data: userInfo } = useUserInfoQuery();

  const { data } = usePointSystemLogQuery("score");

  const filteredData = data?.filter(
    (obj) =>
      dayjsToStr(dayjs(obj.timestamp).startOf("month")) === dayjsToStr(dayjs().startOf("month")),
  );
  const { data: noticeLogs } = useNoticeActiveLogQuery("like");

  const scoreObj = filteredData?.reduce(
    (acc, cur) => {
      const value = cur.meta.value;
      if (cur.message.includes("번개 모임")) {
        return { ...acc, gather: acc.gather + value };
      }
      if (cur.message.includes("스터디")) {
        return { ...acc, study: acc.study + value };
      }
      return acc;
    },
    { study: 0, gather: 0 },
  );

  const totalScore = scoreObj?.study + scoreObj?.gather;

  const footerOptions: IFooterOptions = {
    main: {},
    sub: {
      text: "기록 보기",
      func: () => router.push("/user/score"),
    },
    isFull: true,
  };

  const likeCnt = noticeLogs?.filter((item) =>
    dayjs(item.createdAt).isAfter(dayjs().startOf("month")),
  ).length;
  return (
    <ModalLayout
      title={`${dayjs().month() + 1}월 활동 점수표`}
      footerOptions={footerOptions}
      setIsModal={setIsModal}
    >
      <Flex align="center">
        <Avatar
          image={userInfo?.profileImage}
          uid={userInfo?.uid}
          avatar={userInfo?.avatar}
          size="mds"
        />

        <Box ml={2} lineHeight="16px" fontSize="12px" fontWeight="semibold" color="var(--gray-800)">
          {userInfo?.name} ({USER_ROLE?.[userInfo?.role]})
        </Box>
        <Box ml="auto">
          <UserBadge uid={userInfo?.uid} score={userInfo?.score} />
        </Box>
      </Flex>
      <Box my={3} h="1px" bg="gray.100" />

      <Box mb={3}>
        <ProgressMark value={userInfo?.monthScore} />
      </Box>

      <Info>
        {scoreObj ? (
          <>
            <Item>
              <span>이번 달 동아리 점수</span>
              <span>{userInfo?.monthScore} 점</span>
            </Item>
            <Item>
              <span>이번 달 스터디 점수</span>
              <span>{scoreObj.study} 점</span>
            </Item>
            <Item>
              <span>이번 달 모임 점수</span>
              <span>{scoreObj.gather} 점</span>
            </Item>
            <Item>
              <span>이번 달에 받은 좋아요</span>
              <span>{likeCnt || 0} 개</span>
            </Item>
          </>
        ) : (
          <>
            <Item>
              <span>이번 달 동아리 점수</span>
              <Box w="36px" h="20px">
                <Skeleton>2</Skeleton>
              </Box>
            </Item>
            <Item>
              <span>이번 달 스터디 점수</span>
              <Box w="36px" h="20px">
                <Skeleton>2</Skeleton>
              </Box>
            </Item>
            <Item>
              <span>이번 달 모임 점수</span>
              <Box w="36px" h="20px">
                <Skeleton>2</Skeleton>
              </Box>
            </Item>
            <Item>
              <span>이번 달에 받은 좋아요</span>

              <Box w="36px" h="20px">
                <Skeleton>2</Skeleton>
              </Box>
            </Item>
          </>
        )}
      </Info>

      <Message>
        {totalScore >= 0 &&
          (dayjs(userInfo?.registerDate).diff(dayjs(), "month") === 0 ? (
            <div>
              🎉신규 가입을 환영해요🎉
              <br />
              앞으로 열심히 활동해봐요~!
            </div>
          ) : totalScore >= 30 ? (
            <Box>
              🏆당신은 열활멤버이시군요!!🏆 <br />
              다음 정산때 추가 포인트를 획득합니다 !!
            </Box>
          ) : totalScore >= 10 ? (
            <div>
              🎉잘 하고 있어요!!🎉
              <br />
              월간 최소 점수를 달성했습니다 !!
            </div>
          ) : (
            <div>
              🍒이번 달도 파이팅🍒
              <br />
              같이 열심히 활동해요!
            </div>
          ))}
      </Message>
    </ModalLayout>
  );
}

const Message = styled.div`
  padding: 12px 16px;
  min-height: 48px;
  border-radius: 8px;
  color: var(--gray-600);
  font-size: 11px;
  font-weight: medium;
  background-color: var(--gray-100);
`;

const Info = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`;

const Item = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  font-size: 11px;
  margin: 4px 0;

  > span:first-child {
    font-weight: regular;
    color: var(--gray-600);
  }
  > span:last-child {
    font-weight: medium;
    color: var(--gray-800);
  }
`;

export default LastWeekAttendPopUp;
