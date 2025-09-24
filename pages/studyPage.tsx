import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import IconRowBlock from "../components/atoms/blocks/IconRowBlock";
import Slide from "../components/layouts/PageSlide";
import { useTypeToast } from "../hooks/custom/CustomToast";
import { useStudyPassedDayQuery, useStudySetQuery } from "../hooks/study/queries";
import StudyPageCalendar from "../pageTemplates/studyPage/StudyPageCalendar";
import StudyPageChallenge from "../pageTemplates/studyPage/StudyPageChallenge";
import StudyPageHeader from "../pageTemplates/studyPage/StudyPageHeader";
import StudyPageMap from "../pageTemplates/studyPage/studyPageMap/StudyPageMap";
import StudyPageNav from "../pageTemplates/studyPage/StudyPageNav";
import StudyPagePlaceSection from "../pageTemplates/studyPage/StudyPagePlaceSection";
import StudyControlButton from "../pageTemplates/vote/StudyControlButton";

export default function StudyPage() {
  const typeToast = useTypeToast();
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const dateParam = searchParams.get("date");

  const isGuest = session?.user.role === "guest";

  const [tab, setTab] = useState<"스터디 참여" | "카공 지도">("스터디 참여");
  const [date, setDate] = useState<string>(null);

  const isPassedDate = !!date && dayjs(date).startOf("day").isBefore(dayjs().startOf("day"));

  const { data: studySet } = useStudySetQuery(date, { enabled: !!date && !isPassedDate });

  const { data: passedStudyData } = useStudyPassedDayQuery(date, {
    enabled: !!date && !!isPassedDate,
  });

  useEffect(() => {
    if (!dateParam || dateParam === date) return;
    setDate(dateParam);
  }, [dateParam]);

  useEffect(() => {
    if (!date || dateParam === date) return;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("date", date);
    router.replace(`/studyPage?${newSearchParams.toString()}`, { scroll: false });
  }, [date]);

  return (
    <>
      <StudyPageHeader />
      <Slide isNoPadding>
        <StudyPageNav setTab={setTab} />
      </Slide>
      <>
        {tab === "스터디 참여" ? (
          <Slide>
            <StudyPageCalendar date={date} setDate={setDate} />
            <StudyPagePlaceSection
              studySet={isPassedDate ? passedStudyData : studySet}
              date={date}
              setDate={setDate}
            />
            <StudyPageChallenge />
          </Slide>
        ) : (
          <Slide isNoPadding>
            <Box h={5} />
            <Box mx={5} mb={2} fontSize="16px" fontWeight={600}>
              ⬇️ &apos;찐&apos; 카공러들이 선별한 카공 맛집 지도! ⬇️
            </Box>
            <StudyPageMap />
            <Box mx={5}>
              <Box mt={5}>
                <IconRowBlock
                  leftIcon={<MapIcon />}
                  func={() => router.push("/study/writing/place")}
                  mainText="신규 스터디 장소 추가"
                  subText="공부하기 좋은 카공 스팟을 함께 공유해요!"
                />
              </Box>
              <Box mt={5}>
                <IconRowBlock
                  leftIcon={<ReviewIcon />}
                  func={() => typeToast("not-yet")}
                  mainText="카페 후기 모아 보기"
                  subText="카공러들의 찐 후기를 한 눈에 확인하세요!"
                />
              </Box>
            </Box>
          </Slide>
        )}
      </>
      {!isGuest && (
        <Box mb={20} mt={5}>
          <StudyControlButton date={date} />
        </Box>
      )}
    </>
  );
}

function MapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="var(--gray-700)"
    >
      <path d="M640-240q34 0 56.5-20t23.5-60q1-34-22.5-57T640-400q-34 0-57 23t-23 57q0 34 23 57t57 23Zm0 80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 43.5T778-238l74 74q11 11 11 28t-11 28q-11 11-28 11t-28-11l-74-74q-18 11-38.5 16.5T640-160Zm-466 28q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l186-63q13-5 26-5t26 5l214 75 186-72q20-8 37 4.5t17 33.5v270q0 17-16 23t-29-6q-33-28-72.5-42.5T640-560h-17q-9 0-17 2-18 2-32-8.5T560-594v-92l-160-56v481q0 19-10.5 34T362-205l-188 73Z" />
    </svg>
  );
}

function ReviewIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="var(--gray-700)"
    >
      <path d="m363-390 117-71 117 71-31-133 104-90-137-11-53-126-53 126-137 11 104 90-31 133ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z" />
    </svg>
  );
}
