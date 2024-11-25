import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import SectionFooterButton from "../../../components/atoms/SectionFooterButton";
import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../../components/molecules/cards/StudyThumbnailCard";
import { StudyThumbnailCardSkeleton } from "../../../components/skeleton/StudyThumbnailCardSkeleton";
import { STUDY_CHECK_POP_UP, STUDY_VOTING_TABLE } from "../../../constants/keys/localStorage";
import {
  STUDY_DATE_START_HOUR,
  STUDY_RESULT_HOUR,
} from "../../../constants/serviceConstants/studyConstants/studyTimeConstant";
import { useCurrentLocation } from "../../../hooks/custom/CurrentLocationHook";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { setStudyToThumbnailInfo } from "../../../libs/study/setStudyToThumbnailInfo";
import { DispatchString } from "../../../types/hooks/reactTypes";
import { StudyMergeParticipationProps } from "../../../types/models/studyTypes/studyDetails";
import { StudyVotingSave } from "../../../types/models/studyTypes/studyInterActions";
import { ActiveLocation, LocationEn } from "../../../types/services/locationTypes";
import { convertLocationLangTo } from "../../../utils/convertUtils/convertDatas";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

interface StudyCardColProps {
  participations: StudyMergeParticipationProps[];
  date: string;
  setDate: DispatchString;
}

function StudyCardCol({ participations, date, setDate }: StudyCardColProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const locationEn =
    (searchParams.get("location") as LocationEn) ||
    convertLocationLangTo(session?.user.location, "en");
  const location = convertLocationLangTo(locationEn, "kr") as ActiveLocation;

  const myUid = session?.user.uid;

  const [studyCardColData, setStudyCardColData] = useState<StudyThumbnailCardProps[]>();

  const { data: userInfo } = useUserInfoQuery();
  const { currentLocation } = useCurrentLocation();

  useEffect(() => {
    if (!participations || !participations.length || currentLocation === undefined) {
      setStudyCardColData(null);
      return;
    }
    const cardList = setStudyToThumbnailInfo(
      participations,
      userInfo?.studyPreference,
      currentLocation,
      date as string,
      true,
      location,
    );

    if (!cardList?.length) return;
    setStudyCardColData(cardList.slice(0, 3));

    let myStudy: StudyMergeParticipationProps = null;
    const studyOpenCheck = localStorage.getItem(STUDY_CHECK_POP_UP);
    participations.forEach((par) =>
      par.members.forEach((who) => {
        if (who.user.uid === myUid && who.isMainChoice) myStudy = par;
      }),
    );

    if (myStudy?.status === "dismissed") {
      if (
        (studyOpenCheck !== dayjsToStr(dayjs()) && dayjs().hour() <= STUDY_DATE_START_HOUR) ||
        dayjs().hour() >= STUDY_RESULT_HOUR
      ) {
        localStorage.setItem(STUDY_CHECK_POP_UP, dayjsToStr(dayjs()));
      }
    }

    if (dayjs(date).isAfter(dayjs().subtract(1, "day"))) {
      let isVoting = false;
      participations.forEach((par) =>
        par.members.forEach((who) => {
          if (who.user.uid === myUid && who.isMainChoice) {
            isVoting = true;
          }
        }),
      );

      const studyVotingTable =
        (JSON.parse(localStorage.getItem(STUDY_VOTING_TABLE)) as StudyVotingSave[]) || [];
      const newEntry = { date, isVoting };

      // 같은 날짜가 있는지 확인하고 업데이트, 없으면 추가
      const updatedTable = studyVotingTable.some((entry) => entry.date === newEntry.date)
        ? studyVotingTable.map((entry) => (entry.date === newEntry.date ? newEntry : entry))
        : [...studyVotingTable, newEntry];

      localStorage.setItem(STUDY_VOTING_TABLE, JSON.stringify(updatedTable));
    }
  }, [participations, currentLocation]);

  const onDragEnd = (panInfo: PanInfo) => {
    const newDate = getNewDateBySwipe(panInfo, date as string);
    if (newDate !== date) {
      setDate(newDate);
      newSearchParams.set("date", newDate);
      router.replace(`/home?${newSearchParams.toString()}`, { scroll: false });
    }
    return;
  };

  const getNewDateBySwipe = (panInfo: PanInfo, date: string) => {
    const { offset, velocity } = panInfo;
    const swipe = swipePower(offset.x, velocity.x);

    let dateDayjs = dayjs(date);
    if (swipe < -swipeConfidenceThreshold) {
      dateDayjs = dateDayjs.add(1, "day");
    } else if (swipe > swipeConfidenceThreshold) {
      dateDayjs = dateDayjs.subtract(1, "day");
    }
    return dayjsToStr(dateDayjs);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <>
      <AnimatePresence initial={false}>
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          onDragEnd={(_, panInfo) => onDragEnd(panInfo)}
        >
          {studyCardColData ? (
            <Flex direction="column">
              {studyCardColData.map((cardData, idx) => (
                <Box key={idx} mb={3}>
                  <StudyThumbnailCard {...cardData} />
                </Box>
              ))}
              {studyCardColData.length >= 3 && (
                <SectionFooterButton url={`/studyList?location=${locationEn}&date=${date}`} />
              )}
            </Flex>
          ) : (
            [1, 2, 3].map((idx) => <StudyThumbnailCardSkeleton key={idx} />)
          )}
        </motion.div>
      </AnimatePresence>

      {/* {dismissedStudy && (
        <StudyOpenCheckModal
          date={date}
          setIsModal={() => setDismissedStudy(null)}
          par={dismissedStudy}
        />
      )} */}
    </>
  );
}

export default StudyCardCol;
