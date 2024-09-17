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
import { useStudyResultDecideMutation } from "../../../hooks/study/mutations";
import { getStudyConfimCondition } from "../../../libs/study/getStudyConfimCondition";
import StudyOpenCheckModal from "../../../modals/study/StudyOpenCheckModal";
import { studyDateStatusState } from "../../../recoils/studyRecoils";
import { IParticipation, StudyStatus } from "../../../types/models/studyTypes/studyDetails";
import { StudyVotingSave } from "../../../types/models/studyTypes/studyInterActions";
import { InactiveLocation, LocationEn } from "../../../types/services/locationTypes";
import { convertLocationLangTo } from "../../../utils/convertUtils/convertDatas";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

interface HomeStudyColProps {
  studyVoteData: IParticipation[];
  isLoading: boolean;
  date: string;
}

function HomeStudyCol({ studyVoteData, isLoading, date }: HomeStudyColProps) {
  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const locationEn = searchParams.get("location") as LocationEn;
  const location = convertLocationLangTo(locationEn, "kr");
  const myUid = session?.user.uid;

  const studyDateStatus = useRecoilValue(studyDateStatusState);
  const [studyCardColData, setStudyCardColData] = useState<IPostThumbnailCard[]>();
  const [dismissedStudy, setDismissedStudy] = useState<IParticipation>();

  const { mutate: decideStudyResult } = useStudyResultDecideMutation(date);

  useEffect(() => {
    if (!studyVoteData || !studyVoteData.length || !session?.user || !studyDateStatus) {
      setStudyCardColData(null);
      return;
    }
    const cardList = setStudyDataToCardCol(studyVoteData, date as string, session?.user.uid);
    setStudyCardColData(cardList.slice(0, 3));

    let myStudy: IParticipation = null;

    const studyOpenCheck = localStorage.getItem(STUDY_CHECK_POP_UP);

    studyVoteData.forEach((par) =>
      par.attendences.forEach((who) => {
        if (who.user.uid === myUid && who.firstChoice) myStudy = par;
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
      studyVoteData.forEach((par) =>
        par.attendences.forEach((who) => {
          if (who.user.uid === myUid && who.firstChoice) {
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

    if (getStudyConfimCondition(studyDateStatus, studyVoteData[1].status)) {
      decideStudyResult();
    }
  }, [studyDateStatus, studyVoteData]);

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
            url={`/studyList/?${newSearchParams.toString()}`}
          />
        ) : (
          <CardColumnLayoutSkeleton />
        )}
      </BlurredPart>

      {dismissedStudy && (
        <StudyOpenCheckModal setIsModal={() => setDismissedStudy(null)} par={dismissedStudy} />
      )}
    </>
  );
}

export const setStudyDataToCardCol = (
  studyData: IParticipation[],
  urlDateParam: string,
  uid: string,
): IPostThumbnailCard[] => {
  const cardColData: IPostThumbnailCard[] = studyData.map((data) => ({
    title: data.place.branch,
    subtitle: data.place.brand,
    participants: data.attendences.map((att) => att.user),
    url: `/study/${data.place._id}/${urlDateParam}`,
    maxCnt: 8,
    image: {
      url: data.place.image,
      priority: true,
    },
    badge: getBadgeText(data.status),
    type: "study",
    statusText:
      data.status === "pending" && data.attendences.some((who) => who.user.uid === uid) && "GOOD",
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
