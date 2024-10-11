import { ThemeTypings } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import BlurredPart from "../../../components/molecules/BlurredPart";
import { IPostThumbnailCard } from "../../../components/molecules/cards/PostThumbnailCard";
import {
  CardColumnLayout,
  CardColumnLayoutSkeleton,
} from "../../../components/organisms/CardColumnLayout";
import { STUDY_CHECK_POP_UP, STUDY_VOTING_TABLE } from "../../../constants/keys/localStorage";
import { LOCATION_RECRUITING, LOCATION_TO_FULLNAME } from "../../../constants/location";
import {
  STUDY_DATE_START_HOUR,
  STUDY_RESULT_HOUR,
} from "../../../constants/serviceConstants/studyConstants/studyTimeConstant";
import StudyOpenCheckModal from "../../../modals/study/StudyOpenCheckModal";
import { studyDateStatusState } from "../../../recoils/studyRecoils";
import {
  StudyParticipationProps,
  StudyStatus,
} from "../../../types/models/studyTypes/studyDetails";

import { StudyVotingSave } from "../../../types/models/studyTypes/studyInterActions";
import { InactiveLocation, LocationEn } from "../../../types/services/locationTypes";
import { convertLocationLangTo } from "../../../utils/convertUtils/convertDatas";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import { getDistanceFromLatLonInKm } from "../../../utils/mathUtils";

interface HomeStudyColProps {
  participations: StudyParticipationProps[];
  isLoading: boolean;
  date: string;
}

function HomeStudyCol({ participations, isLoading, date }: HomeStudyColProps) {
  const { data: session } = useSession();

  const searchParams = useSearchParams();

  const locationEn =
    (searchParams.get("location") as LocationEn) ||
    convertLocationLangTo(session?.user.location, "en");
  const location = convertLocationLangTo(locationEn, "kr");

  const myUid = session?.user.uid;

  const studyDateStatus = useRecoilValue(studyDateStatusState);
  const [studyCardColData, setStudyCardColData] = useState<IPostThumbnailCard[]>();
  const [dismissedStudy, setDismissedStudy] = useState<StudyParticipationProps>();

  useEffect(() => {
    if (!participations || !participations.length || !session?.user || !studyDateStatus) {
      setStudyCardColData(null);
      return;
    }
    const cardList = setStudyDataToCardCol(participations, date as string, session?.user.uid);

    setStudyCardColData(cardList.slice(0, 3));

    let myStudy: StudyParticipationProps = null;
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
        setDismissedStudy(myStudy);
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
  }, [studyDateStatus, participations]);

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
        {!isLoading && studyCardColData ? (
          <CardColumnLayout
            cardDataArr={studyCardColData}
            url={`/studyList?tab=study&location=${locationEn}&date=${date}`}
          />
        ) : (
          <CardColumnLayoutSkeleton />
        )}
      </BlurredPart>

      {dismissedStudy && (
        <StudyOpenCheckModal
          date={date}
          setIsModal={() => setDismissedStudy(null)}
          par={dismissedStudy}
        />
      )}
    </>
  );
}

export const setStudyDataToCardCol = (
  studyData: StudyParticipationProps[],
  urlDateParam: string,
  uid: string,
): IPostThumbnailCard[] => {
  console.log(51, studyData[0]);
  const cardColData: IPostThumbnailCard[] = [...studyData]
    ?.sort((a, b) =>
      a.place.branch === "개인 스터디" ? 1 : b.place.branch === "개인 스터디" ? -1 : 0,
    )
    .map((data) => ({
      title: data.place.fullname,
      subtitle: data.place.branch,
      locationDetail: data.place.locationDetail,
      participants: data.members.map((att) => att.user),
      url: `/study/${data.place._id}/${urlDateParam}`,
      maxCnt: 8,
      image: {
        url: data.place.image,
        priority: true,
      },
      distance: 1.4 || getDistanceFromLatLonInKm(2, 2, 2, 2),
      badge: getBadgeText(data.status),
      type: "study",
      statusText:
        data.status === "pending" && data.members.some((who) => who.user.uid === uid) && "GOOD",
      id: data.place._id,
    }));

  return cardColData;
};

const getBadgeText = (
  status: StudyStatus,
): { text: string; colorScheme: ThemeTypings["colorSchemes"] } => {
  switch (status) {
    case "open":
      return { text: "스터디 오픈", colorScheme: "mintTheme" };
    case "dismissed":
      return { text: "닫힘", colorScheme: "grayTheme" };
    case "free":
      return { text: "자유 참여", colorScheme: "purple" };
    case "pending":
      return null;
    default:
      return null;
  }
};

export default HomeStudyCol;
