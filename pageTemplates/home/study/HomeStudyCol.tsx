import { ThemeTypings } from "@chakra-ui/react";
import dayjs from "dayjs";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

import Slide from "../../../components/layouts/PageSlide";
import BlurredPart from "../../../components/molecules/BlurredPart";
import { IPostThumbnailCard } from "../../../components/molecules/cards/PostThumbnailCard";
import {
  CardColumnLayout,
  CardColumnLayoutSkeleton,
} from "../../../components/organisms/CardColumnLayout";
import { STUDY_CHECK_POP_UP, STUDY_VOTING_TABLE } from "../../../constants/keys/localStorage";
import {
  STUDY_DATE_START_HOUR,
  STUDY_RESULT_HOUR,
} from "../../../constants/serviceConstants/studyConstants/studyTimeConstant";
import { useStudyResultDecideMutation } from "../../../hooks/study/mutations";
import { useStudyVoteQuery } from "../../../hooks/study/queries";
import { getStudyConfimCondition } from "../../../libs/study/getStudyConfimCondition";
import { sortStudyVoteData } from "../../../libs/study/sortStudyVoteData";
import StudyOpenCheckModal from "../../../modals/study/StudyOpenCheckModal";
import {
  myStudyState,
  sortedStudyCardListState,
  studyDateStatusState,
} from "../../../recoils/studyRecoils";
import { IParticipation, StudyStatus } from "../../../types/models/studyTypes/studyDetails";
import { StudyVotingSave } from "../../../types/models/studyTypes/studyInterActions";
import { LocationEn } from "../../../types/services/locationTypes";
import { convertLocationLangTo } from "../../../utils/convertUtils/convertDatas";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

export default function HomeStudyCol() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const date = searchParams.get("date");
  const locationEn = searchParams.get("location") as LocationEn;
  const location = convertLocationLangTo(locationEn, "kr");
  const myUid = session?.user.uid;

  const setSortedStudyCardList = useSetRecoilState(sortedStudyCardListState);
  const setMyStudy = useSetRecoilState(myStudyState);
  const studyDateStatus = useRecoilValue(studyDateStatusState);
  const [studyCardColData, setStudyCardColData] = useState<IPostThumbnailCard[]>();
  const [dismissedStudy, setDismissedStudy] = useState<IParticipation>();

  const { data: studyVoteData, isLoading } = useStudyVoteQuery(date as string, location, {
    enabled: !!date && !!location,
  });

  const { mutate: decideStudyResult } = useStudyResultDecideMutation(date);

  useEffect(() => {
    if (!studyVoteData || !studyVoteData.length || !session?.user || !studyDateStatus) {
      setMyStudy(undefined);
      setStudyCardColData(null);
      return;
    }
    const sortedData = sortStudyVoteData(studyVoteData, studyDateStatus !== "not passed");

    const cardList = setStudyDataToCardCol(sortedData, date as string, session?.user.uid);

    setStudyCardColData(cardList.slice(0, 3));
    setSortedStudyCardList(cardList);
    let myStudy: IParticipation = null;

    const studyOpenCheck = localStorage.getItem(STUDY_CHECK_POP_UP);

    studyVoteData.forEach((par) =>
      par.attendences.forEach((who) => {
        if (who.user.uid === myUid && who.firstChoice) myStudy = par;
      }),
    );

    if (myStudy?.status !== "dismissed") setMyStudy(myStudy);
    else {
      if (
        (studyOpenCheck !== dayjsToStr(dayjs()) && dayjs().hour() <= STUDY_DATE_START_HOUR) ||
        dayjs().hour() >= STUDY_RESULT_HOUR
      ) {
        setDismissedStudy(myStudy);
        localStorage.setItem(STUDY_CHECK_POP_UP, dayjsToStr(dayjs()));
      }
      setMyStudy(null);
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

  const onDragEnd = (panInfo: PanInfo) => {
    const newDate = getNewDateBySwipe(panInfo, date as string);
    if (newDate !== date) {
      newSearchParams.set("date", newDate);
      router.replace(`/home?${newSearchParams.toString()}`);
    }
    return;
  };

  return (
    <>
      <Slide>
        <AnimatePresence initial={false}>
          <MotionDiv
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, panInfo) => onDragEnd(panInfo)}
            className="study_space"
          >
            <>
              <BlurredPart text={location === null ? "스터디 장소 확정중입니다." : null}>
                {!isLoading && studyCardColData ? (
                  <CardColumnLayout
                    cardDataArr={studyCardColData}
                    url={`/studyList/?${newSearchParams.toString()}`}
                  />
                ) : (
                  <CardColumnLayoutSkeleton />
                )}
              </BlurredPart>
            </>
          </MotionDiv>
        </AnimatePresence>
      </Slide>
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
  const privateStudy = studyData.find((par) => par.place.brand === "자유 신청");
  const filteredData = studyData.filter((par) => par.place.brand !== "자유 신청");

  if (privateStudy) filteredData.splice(2, 0, privateStudy);

  const cardColData: IPostThumbnailCard[] = filteredData.map((data) => ({
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

export const getNewDateBySwipe = (panInfo: PanInfo, date: string) => {
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

const MotionDiv = styled(motion.div)`
  margin-top: 16px;
  margin-bottom: 24px;
`;
