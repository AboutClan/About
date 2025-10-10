import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { MainLoading } from "../../../../components/atoms/loaders/MainLoading";
import Slide from "../../../../components/layouts/PageSlide";
import { useUserInfo } from "../../../../hooks/custom/UserHooks";
import { useStudyPassedDayQuery, useStudySetQuery } from "../../../../hooks/study/queries";
import { shortenParticipations } from "../../../../libs/study/studyConverters";
import { getMyStudyDateArr } from "../../../../libs/study/studyHelpers";
import StudyLinkModal from "../../../../pageTemplates/study/modals/StudyLinkModal";
import StudyAddressMap from "../../../../pageTemplates/study/StudyAddressMap";
import StudyCover from "../../../../pageTemplates/study/StudyCover";
import StudyDateBar from "../../../../pageTemplates/study/StudyDateBar";
import StudyDateControl from "../../../../pageTemplates/study/StudyDateControl";
import StudyHeader from "../../../../pageTemplates/study/StudyHeader";
import StudyMembers from "../../../../pageTemplates/study/StudyMembers";
import StudyNavigation from "../../../../pageTemplates/study/StudyNavigation";
import StudyNearMap from "../../../../pageTemplates/study/StudyNearMap";
import StudyNearMemberSection from "../../../../pageTemplates/study/StudyNearMemberSection";
import StudyOverview from "../../../../pageTemplates/study/StudyOverView";
import StudyPendingSection from "../../../../pageTemplates/study/StudyPendingSection";
import StudyReviewButton from "../../../../pageTemplates/study/StudyReviewButton";
import StudyTimeBoard from "../../../../pageTemplates/study/StudyTimeBoard";
import { backUrlState } from "../../../../recoils/navigationRecoils";
import {
  MyStudyStatus,
  StudyConfirmedMemberProps,
  StudyParticipationProps,
} from "../../../../types/models/studyTypes/study-entity.types";
import {
  StudyConfirmedSetProps,
  StudyParticipationsSetProps,
  StudyType,
} from "../../../../types/models/studyTypes/study-set.types";
import { dayjsToStr, getHour } from "../../../../utils/dateTimeUtils";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id, date } = useParams<{ id: string; date: string }>() || {};
  const userInfo = useUserInfo();
  const isPassedDate = !!date && dayjs(date).startOf("day").isBefore(dayjs().startOf("day"));
  const [backUrl, setBackUrl] = useRecoilState(backUrlState);

  const studyType = searchParams.get("type") as StudyType;

  const { data: studySet } = useStudySetQuery(
    studyType === "participations" ? dayjsToStr(dayjs()) : date,
    { enabled: !!date && !isPassedDate },
  );
  const { data: studyPassedData } = useStudyPassedDayQuery(date, {
    enabled: !!isPassedDate,
  });

  const [modalType, setModalType] = useState<"studyLink" | "review">();

  useEffect(() => {
    const handlePopState = () => {
      if (backUrl) {
        router.push(backUrl); // Next.js 라우터 이동
        setBackUrl(null);
      } else {
        router.push(`/studyPage?date=${date}`);
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [backUrl]);

  const studyData = isPassedDate
    ? studyPassedData && studyPassedData[studyType]
    : studySet && studySet[studyType];

  const participationsSet =
    studyType === "participations" && (studyData as StudyParticipationsSetProps[]);
  const confirmedSet = studyType !== "participations" && (studyData as StudyConfirmedSetProps[]);

  const findStudy =
    studyType !== "participations" &&
    confirmedSet?.find((set) => set.study.place._id === id)?.study;

  const myStudyInfo =
    studyType === "soloRealTimes"
      ? studySet?.soloRealTimes
          ?.flatMap((solo) => solo.study)
          ?.flatMap((a) => a.members)
          ?.find((solo) => solo.user._id === userInfo?._id)
      : studyType !== "participations"
      ? findStudy?.members.find((member) => member.user._id === userInfo?._id)
      : participationsSet
          ?.find((par) => par.study.some((study) => study.user._id === userInfo?._id))
          ?.study?.filter((who) => who.user._id === userInfo?._id);

  const myStudyArr = getMyStudyDateArr(studySet, userInfo?._id);

  const findTodayStudy = myStudyArr?.find((myStudy) => myStudy.date === date);

  const myStudyStatus: MyStudyStatus =
    (!findTodayStudy && studyType !== "participations") ||
    (studyType === "participations" &&
      !shortenParticipations(participationsSet).some((par) => par.user._id === userInfo?._id))
      ? "pending"
      : findTodayStudy?.type === studyType
      ? "participation"
      : "otherParticipation";

  const members =
    studyType === "participations"
      ? shortenParticipations(participationsSet)
      : studyType === "soloRealTimes"
      ? (studyData as StudyConfirmedSetProps[])?.map((study) => ({
          ...study.study.members[0],
        }))
      : findStudy?.members;
  const placeInfo = findStudy?.place;

  const studyLinkCondition =
    myStudyStatus === "participation" &&
    studyType !== "soloRealTimes" &&
    studyType !== "participations";

  useEffect(() => {
    if (!studyLinkCondition) return;
    const hasLink = localStorage.getItem("studyLink");
    if (hasLink === date) return;
    setModalType("studyLink");
  }, [myStudyStatus]);

  const isMyReview = placeInfo?.reviews?.some((review) => review.user._id === userInfo?._id);

  const [dateDayjs, setDateDayjs] = useState(
    date === dayjsToStr(dayjs()) && getHour() >= 9 ? dayjs(date).add(1, "day") : dayjs(date),
  );

  const isOpenStudy = studyType !== "participations" && studyType !== "soloRealTimes";
  console.log(52, members);
  return (
    <>
      {studyPassedData || studySet ? (
        <>
          <StudyHeader date={date} placeInfo={placeInfo} />
          <Box mb={5}>
            <Slide isNoPadding>
              <StudyCover studyType={studyType} coverImage={placeInfo?.coverImage} />
              <StudyOverview
                isMyStudy={!!myStudyInfo}
                date={date}
                placeInfo={placeInfo}
                studyType={studyType}
              />
            </Slide>
            <Box h={2} bg="gray.100" />
            <Slide>
              {isOpenStudy && <StudyAddressMap location={placeInfo.location} />}
              <StudyDateBar
                date={date}
                members={members}
                studyType={studyType}
                placeInfo={placeInfo}
              />
              {isOpenStudy && <StudyTimeBoard members={members as StudyConfirmedMemberProps[]} />}
              <Box h="1px" bg="gray.100" my={4} />
              <Box pb={2} pos="relative">
                {studyType === "participations" && (
                  <StudyDateControl date={dateDayjs} setDate={setDateDayjs} />
                )}
                <StudyMembers
                  date={dayjsToStr(dateDayjs)}
                  members={members || []}
                  studyType={studyType}
                  hasStudyLink={myStudyStatus === "participation"}
                />
              </Box>
              {studyType === "participations" && (
                <>
                  <StudyNearMemberSection
                    myStudyInfo={myStudyInfo as StudyParticipationProps}
                    members={members as StudyParticipationProps[]}
                  />{" "}
                </>
              )}
            </Slide>
            {studyType === "participations" && (
              <>
                <Box h={2} bg="gray.100" my={4} />
                <Slide>
                  <StudyPendingSection studySet={studySet} />
                </Slide>
              </>
            )}
            {placeInfo && <StudyNearMap centerPlace={placeInfo} />}
          </Box>
          {userInfo?.role !== "guest" && (
            <StudyNavigation
              myStudyInfo={myStudyInfo}
              date={date}
              id={id}
              myStudyStatus={myStudyStatus}
              studyType={studyType}
              location={placeInfo?.location}
              findStudy={findStudy}
              tempCheck={
                !members?.some((member) => member.user._id === userInfo._id) &&
                studyType === "participations"
              }
            />
          )}
          {!isMyReview &&
            date === dayjsToStr(dayjs()) &&
            (studyType === "openRealTimes" || studyType === "results") && (
              <StudyReviewButton
                placeId={placeInfo?._id}
                myStudyInfo={myStudyInfo as StudyConfirmedMemberProps}
              />
            )}
          {/* {isInviteModal && <StudyInviteModal setIsModal={setIsInviteModal} place={place} />} */}
        </>
      ) : (
        <MainLoading />
      )}
      {modalType === "studyLink" && (
        <StudyLinkModal studyType={studyType} date={date} onClose={() => setModalType(null)} />
      )}
      {studyType === "participations" && <Box h={5} />}
    </>
  );
}
