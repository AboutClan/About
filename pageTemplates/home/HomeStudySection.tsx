import dayjs from "dayjs";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

import BlurredPart from "../../components/molecules/BlurredPart";
import { IPostThumbnailCard } from "../../components/molecules/cards/PostThumbnailCard";
import {
  CardColumnLayout,
  CardColumnLayoutSkeleton,
} from "../../components/organisms/CardColumnLayout";
import { HAS_STUDY_TODAY } from "../../constants/keys/localStorage";
import { useStudyResultDecideMutation } from "../../hooks/study/mutations";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { getMyStudy } from "../../libs/study/getMyStudy";
import { getStudyConfimCondition } from "../../libs/study/getStudyConfimCondition";
import { sortStudyVoteData } from "../../libs/study/sortStudyVoteData";
import {
  myStudyState,
  sortedStudyCardListState,
  studyDateStatusState,
} from "../../recoils/studyRecoils";
import { ITextAndColorSchemes } from "../../types/components/propTypes";
import { IParticipation, StudyStatus } from "../../types/models/studyTypes/studyDetails";
import { LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToStr } from "../../utils/dateTimeUtils";

export default function HomeStudySection() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const date = searchParams.get("date");
  const location = convertLocationLangTo(searchParams.get("location") as LocationEn, "kr");

  const myUid = session?.user.uid;

  const setSortedStudyCardList = useSetRecoilState(sortedStudyCardListState);
  const setMyStudy = useSetRecoilState(myStudyState);
  const studyDateStatus = useRecoilValue(studyDateStatusState);
  const [studyCardColData, setStudyCardColData] = useState<IPostThumbnailCard[]>();

  const { data: studyVoteData, isLoading } = useStudyVoteQuery(date as string, location, {
    enabled: !!date && !!location,
  });

  const { mutate: decideStudyResult } = useStudyResultDecideMutation(date);

  useEffect(() => {
    if (!studyVoteData || !studyVoteData.length || !session?.user || !studyDateStatus) {
      setStudyCardColData(null);
      return;
    }
    console.log(1, studyVoteData, studyDateStatus);
    const sortedData = sortStudyVoteData(studyVoteData, studyDateStatus !== "not passed");

    const cardList = setStudyDataToCardCol(sortedData, date as string, session?.user.uid);
    setStudyCardColData(cardList.slice(0, 3));
    setSortedStudyCardList(cardList);

    const myStudy = getMyStudy(studyVoteData, myUid);
    setMyStudy(myStudy);

    if (date === dayjsToStr(dayjs())) {
      const myInfo = myStudy?.attendences.find((who) => who.user.uid === myUid);
      if (myInfo) {
        if (myInfo?.arrived && dayjs().hour() >= 20) {
          localStorage.setItem(HAS_STUDY_TODAY, undefined);
        } else {
          localStorage.setItem(HAS_STUDY_TODAY, "true");
        }
      }
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
    <AnimatePresence initial={false}>
      <MotionDiv
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={1}
        onDragEnd={(_, panInfo) => onDragEnd(panInfo)}
        className="study_space"
      >
        <>
          <BlurredPart
            isBlur={location === "안양"}
            text={
              location === "안양"
                ? "안양 지역은 톡방에서 별도 운영중입니다!"
                : location === null
                  ? "스터디 장소 확정중입니다."
                  : null
            }
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
        </>
      </MotionDiv>
    </AnimatePresence>
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
    badge: getBadgeText(data.status, getVotePoint(data.attendences.length)),
    statusText:
      data.status === "pending" && data.attendences.some((who) => who.user.uid === uid) && "GOOD",
  }));
  return cardColData;
};

const getVotePoint = (attCnt: number) => (attCnt === 0 ? 10 : attCnt === 5 ? 2 : 2);

const getBadgeText = (status: StudyStatus, point: number): ITextAndColorSchemes => {
  switch (status) {
    case "open":
      return { text: "open", colorScheme: "green" };
    case "dismissed":
      return { text: "closed", colorScheme: "gray" };
    case "free":
      return { text: "free", colorScheme: "purple" };
    case "pending":
      return { text: `+${point} POINT`, colorScheme: "redTheme" };
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
  padding: 16px;
`;
