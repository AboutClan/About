import { Box, Collapse, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import Avatar from "../../components/atoms/Avatar";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import ProfileCommentCard from "../../components/molecules/cards/ProfileCommentCard";
import InfoBoxCol from "../../components/molecules/InfoBoxCol";
import ProgressMark from "../../components/molecules/ProgressMark";
import ValueBoxCol, { ValueBoxColItemProps } from "../../components/molecules/ValueBoxCol";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import { useMonthScoreLogQuery, useUserInfoQuery } from "../../hooks/user/queries";

interface UserScoreGuideDrawerProps {
  onClose: () => void;
}

function UserScoreGuideDrawer({ onClose }: UserScoreGuideDrawerProps) {
  const { data: userInfo } = useUserInfoQuery();

  const { data } = useMonthScoreLogQuery();

  const [obj, setObj] = useState<{ study: number; gather: number; dailyCheck: number }>();

  useEffect(() => {
    if (!data) return;
    const result = data.reduce(
      (acc, cur) => {
        const value = cur.meta.value;
        if (cur.message.includes("데일리 출석체크")) {
          return { ...acc, dailyCheck: acc.gather + value };
        }
        if (cur.message.includes("번개")) {
          return { ...acc, gather: acc.gather + value };
        }
        if (cur.message.includes("스터디") || cur.message.includes("공부")) {
          return { ...acc, study: acc.study + value };
        }

        return acc;
      },
      { study: 0, gather: 0, dailyCheck: 0 },
    );
    setObj(result);
  }, [data]);

  const valueArr: ValueBoxColItemProps[] = obj && [
    {
      left: "일일 출석체크 점수",
      right: `${obj.dailyCheck} 점`,
    },
    {
      left: "이번 달 스터디 점수",
      right: `${obj.study} 점`,
    },
    {
      left: "이번 달 모임 점수",
      right: `${obj.gather} 점`,
    },
    {
      left: "최종 월간 점수",
      right: `= ${userInfo.monthScore} 점`,
      isFinal: true,
    },
  ];

  const [isBenefit, setIsBenefit] = useState(false);

  const benefitArr: { category: string; text: string }[] = [
    { category: "데일리 출석체크", text: "2점" },
    { category: "스터디 출석체크", text: "5점" },
    { category: "개인 공부 인증", text: "2점" },
    { category: "번개 모임 참여", text: "5점" },
    { category: "번개 모임 개설", text: "10점" },
  ];

  //   (
  //   Object.entries(benefitProps) as [BenefitName, number][]
  // ).map(([name, value]) => ({
  //   category: BENEFIT_MAPPING[name],
  //   text: value.toLocaleString() + "원",
  // }));

  return (
    <RightDrawer title="월간 동아리 점수" px={false} onClose={onClose}>
      <Box mx={5} mb={1}>
        <ProfileCommentCard user={userInfo} memo={userInfo?.comment} />

        <Box my={3} h="1px" bg="gray.100" />

        <Box mb={3}>
          <ProgressMark value={userInfo?.monthScore} />
        </Box>
        <Box>{obj && <ValueBoxCol items={valueArr} />}</Box>
      </Box>
      <Box mt={5} px={5} borderTop="var(--border)" pb={1}>
        <Collapse in={isBenefit} animateOpacity unmountOnExit>
          <Box h="1px" bg="gray.100" w="full" mb={5} />
          <Box px={5} mb={1} borderTop="var(--border)">
            <InfoBoxCol infoBoxPropsArr={benefitArr} />
          </Box>
        </Collapse>
      </Box>
      <Box
        fontSize="13px"
        mb={5}
        w="full"
        py={1.5}
        as="button"
        color="white"
        bg="mint"
        borderBottomRadius="12px"
        onClick={() => setIsBenefit((old) => !old)}
      >
        <Flex justify="center" align="center">
          점수 획득 방법
          <Box ml={1}>
            <ShortArrowIcon dir={isBenefit ? "top" : "bottom"} color="white" />
          </Box>
        </Flex>
      </Box>
      <Flex py={4} justify="space-between" px={10} borderBottom="var(--border)">
        <Avatar size="xl2" user={{ avatar: { type: 7, bg: 6 } }} />
        <Flex flexDir="column" alignItems="flex-end">
          <Box fontSize="18px" fontWeight="bold" color="mint" mb={1}>
            동아리 규칙
          </Box>
          <Box as="p" textAlign="end">
            월 최소 활동 점수는 <b>10점</b>이에요.
            <br />
            최소 기준 미달 시 <b>1,000원</b>이 차감돼요.
          </Box>
        </Flex>
      </Flex>{" "}
      <Flex py={4} flexDir="row-reverse" justify="space-between" align="center" px={10}>
        <Avatar size="xl2" user={{ avatar: { type: 16, bg: 8 } }} />
        <Flex flexDir="column">
          <Box fontSize="18px" fontWeight="bold" color="mint" mb={1}>
            동아리 점수 보상
          </Box>
          <Box as="p" fontSize="14px">
            동아리 점수를 모으면
            <br />
            아바타, 배지, 포인트를 획득할 수 있어요!
          </Box>
        </Flex>
      </Flex>
      <Flex py={4} justify="space-between" px={10} align="center">
        <Avatar size="xl2" user={{ avatar: { type: 10, bg: 3 } }} />
        <Flex flexDir="column" align="flex-end">
          <Box fontSize="18px" fontWeight="bold" color="mint" mb={1}>
            월간 랭킹 보상
          </Box>
          <Box as="p" textAlign="end">
            매월 점수 랭킹 정산으로
            <br />
            최대 10,000 Point가 지급돼요.
          </Box>
        </Flex>
      </Flex>
      <Flex py={4} flexDir="row-reverse" align="center" justify="space-between" px={10}>
        <Avatar size="xl2" user={{ avatar: { type: 20, bg: 2 } }} />
        <Flex flexDir="column">
          <Box fontSize="18px" fontWeight="bold" color="mint" mb={1}>
            휴식 신청
          </Box>
          <Box as="p">
            만약 이번 달 활동이 어렵다면,
            <br />내 정보에서 미리 [휴식 신청]을 해보세요!
          </Box>
        </Flex>
      </Flex>{" "}
    </RightDrawer>
  );
}

export default UserScoreGuideDrawer;
