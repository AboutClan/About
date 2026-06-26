import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import BottomNav from "../../components/layouts/BottomNav";
import Header from "../../components/layouts/Header";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import { useStudyPassedDayQuery, useStudySetQuery } from "../../hooks/study/queries";
import { getSafeAreaBottom } from "../../utils/validationUtils";
import StudyPageCalendar from "./StudyPageCalendar";
import StudyPagePlaceSection from "./StudyPagePlaceSection";

function getTodayStr() {
  return dayjs().format("YYYY-MM-DD");
}

export default function CafeMapStudyPage() {
  const [date, setDate] = useState<string>(getTodayStr());
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  const isPassedDate = useMemo(
    () => dayjs(date).startOf("day").isBefore(dayjs().startOf("day")),
    [date],
  );

  const { data: studySet } = useStudySetQuery(date, {
    enabled: !!date && !isPassedDate,
  });

  const { data: passedStudyData } = useStudyPassedDayQuery(date, {
    enabled: !!date && isPassedDate,
  });

  return (
    <>
      <Flex
        flexDir="column"
        pos="fixed"
        top={0}
        left={0}
        right={0}
        bottom={getSafeAreaBottom(52)}
        zIndex={500}
        bg="white"
        maxW="var(--max-width)"
        mx="auto"
      >
        <Header title="스터디" isBack={false} isSlide={false} />

        <Box flex={1} overflowY="auto" px={5}>
          <StudyPageCalendar date={date} setDate={setDate} onDateChange={setDate} />
          <StudyPagePlaceSection
            studySet={isPassedDate ? passedStudyData : studySet}
            date={date}
            setDate={setDate}
            hideLounge
          />
        </Box>
      </Flex>

      {isPopupOpen && (
        <BottomFlexDrawer
          isHideBottom
          height={512}
          isDrawerUp
          setIsModal={() => setIsPopupOpen(false)}
          isOverlay
          zIndex={701}
        >
          <Flex flexDir="column" w="full">
            <Box fontSize="20px" fontWeight={800} mb={1}>
              🚀 우리 동네 카공 스터디
            </Box>
            <Box fontSize="13px" fontWeight={700} color="var(--color-mint)" mb={4}>
              7월 1일 출시 예정
            </Box>

            <Box fontSize="13px" color="gray.700" lineHeight="22px" mb={4}>
              혼자서는 공부가 잘 안되는 날,
              <br />
              언제 어디서든 카공할 사람을 찾고,
              <br />
              함께 성장할 수 있는 카공 문화를 만들어가고자 합니다.
            </Box>

            <Box
              fontSize="13px"
              color="gray.500"
              lineHeight="20px"
              bg="gray.50"
              fontWeight={500}
              borderRadius="10px"
              px={3}
              py={3}
              mb={4}
            >
              현재는 프리뷰 서비스로 미리보기만 가능합니다.
              <br />
              오픈 후 누구나 이용할 수 있어요!
            </Box>

            <Box fontSize="14px" fontWeight={700} mb={2}>
              ✨ 스터디 기능 설명
            </Box>
            <Flex flexDir="column" gap={1.5} mb={5}>
              {[
                "실명 인증 기반 · 가입비 없음",
                "스터디 개설 및 참여 신청",
                "스터디장 & 승인제 시스템",
                "출석 체크 및 스터디 편의 기능",
                "노쇼 패널티 시스템 & 모임 후 멤버 평가",
                "매너온도 기반 신뢰 관리",
              ].map((text) => (
                <Flex key={text} align="center" gap={2}>
                  <Box w="4px" h="4px" borderRadius="full" bg="var(--color-mint)" flexShrink={0} />
                  <Box fontSize="13px" color="gray.700">
                    {text}
                  </Box>
                </Flex>
              ))}
            </Flex>

            <BottomNav isSlide={false} text="확인했어요" onClick={() => setIsPopupOpen(false)} />
          </Flex>
        </BottomFlexDrawer>
      )}
    </>
  );
}
