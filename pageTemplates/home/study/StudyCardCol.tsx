import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import SectionFooterButton from "../../../components/atoms/SectionFooterButton";
import BlurredPart from "../../../components/molecules/BlurredPart";
import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../../components/molecules/cards/StudyThumbnailCard";
import { StudyThumbnailCardSkeleton } from "../../../components/skeleton/StudyThumbnailCardSkeleton";
import { STUDY_CHECK_POP_UP, STUDY_VOTING_TABLE } from "../../../constants/keys/localStorage";
import { LOCATION_RECRUITING, LOCATION_TO_FULLNAME } from "../../../constants/location";
import {
  STUDY_DATE_START_HOUR,
  STUDY_RESULT_HOUR,
} from "../../../constants/serviceConstants/studyConstants/studyTimeConstant";
import { setStudyToThumbnailInfo } from "../../../libs/study/setStudyToThumbnailInfo";
import { StudyMergeParticipationProps } from "../../../types/models/studyTypes/studyDetails";
import { StudyVotingSave } from "../../../types/models/studyTypes/studyInterActions";
import {
  ActiveLocation,
  InactiveLocation,
  LocationEn,
} from "../../../types/services/locationTypes";
import { convertLocationLangTo } from "../../../utils/convertUtils/convertDatas";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

interface StudyCardColProps {
  participations: StudyMergeParticipationProps[];
  date: string;
}

function StudyCardCol({ participations, date }: StudyCardColProps) {
  const { data: session } = useSession();

  const searchParams = useSearchParams();

  const locationEn =
    (searchParams.get("location") as LocationEn) ||
    convertLocationLangTo(session?.user.location, "en");
  const location = convertLocationLangTo(locationEn, "kr") as ActiveLocation;

  const myUid = session?.user.uid;

  const [studyCardColData, setStudyCardColData] = useState<StudyThumbnailCardProps[]>();

  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number }>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setCurrentLocation({ lat, lon });
      },
      function (error) {
        console.error("위치 정보를 가져오는 데 실패했습니다: ", error);
      },
      {
        enableHighAccuracy: true, // 고정밀도 모드 활성화
        timeout: 5000, // 5초 안에 위치를 가져오지 못하면 오류 발생
        maximumAge: 0, // 캐시된 위치 정보를 사용하지 않음
      },
    );
  }, []);

  useEffect(() => {
    if (!participations || !participations.length) {
      setStudyCardColData(null);
      return;
    }
    const cardList = setStudyToThumbnailInfo(
      participations,
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

  return (
    <>
      <BlurredPart
        text={
          LOCATION_RECRUITING.includes(location as InactiveLocation)
            ? `${LOCATION_TO_FULLNAME[location]} 오픈 준비중`
            : ""
        }
        isBlur={LOCATION_RECRUITING.includes(location as InactiveLocation)}
        size="lg"
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
      </BlurredPart>

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
