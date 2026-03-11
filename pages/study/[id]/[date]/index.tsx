import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Divider from "../../../../components/atoms/Divider";
import { MainLoading, MainLoadingAbsolute } from "../../../../components/atoms/loaders/MainLoading";
import Slide from "../../../../components/layouts/PageSlide";
import { GroupThumbnailCard } from "../../../../components/molecules/cards/GroupThumbnailCard";
import TabNav from "../../../../components/molecules/navs/TabNav";
import { useToast } from "../../../../hooks/custom/CustomToast";
import { useUserInfo } from "../../../../hooks/custom/UserHooks";
import { useGroupIdQuery } from "../../../../hooks/groupStudy/queries";
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
import StudyOverview from "../../../../pageTemplates/study/StudyOverView";
import StudyPendingSection from "../../../../pageTemplates/study/StudyPendingSection";
import StudyPlaceMap from "../../../../pageTemplates/study/StudyPlaceMap";
import StudyReviewButton from "../../../../pageTemplates/study/StudyReviewButton";
import StudyTimeBoard from "../../../../pageTemplates/study/StudyTimeBoard";
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
import { dayjsToStr, getHour, getTodayStr } from "../../../../utils/dateTimeUtils";
import { createGroupThumbnailProps } from "../../../group";

export default function Page() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const { id, date } = useParams<{ id: string; date: string }>() || {};
  const userInfo = useUserInfo();

  const studyType = searchParams.get("type") as StudyType;
  const studyLocation = searchParams.get("studyLocation") as "true";

  const [dateDayjs, setDateDayjs] = useState(
    studyType === "soloRealTimes"
      ? dayjs(date)
      : date === dayjsToStr(dayjs()) && getHour() >= 9
      ? dayjs(date).add(1, "day")
      : dayjs(date),
  );
  const [tab, setTab] = useState<"일반 스터디" | "스터디 크루">("일반 스터디");

  const isPassedDate =
    studyType !== "soloRealTimes" &&
    !!date &&
    dayjs(date).startOf("day").isBefore(dayjs().startOf("day"));
  const isPassedSolo = studyType === "soloRealTimes" && dateDayjs.isBefore(dayjs().startOf("day"));

  const { data: studySet } = useStudySetQuery(
    studyType === "participations" ? dayjsToStr(dayjs()) : date,
    { enabled: !!date && !isPassedDate },
  );

  const { data: studyPassedData } = useStudyPassedDayQuery(
    isPassedSolo ? dayjsToStr(dateDayjs) : date,
    {
      enabled: !!isPassedDate || !!isPassedSolo,
    },
  );

  const [modalType, setModalType] = useState<"studyLink" | "review">();

  useEffect(() => {
    if (studyLocation === "true") {
      setTab("스터디 크루");
    }
  }, [studyLocation]);

  // useEffect(() => {
  //   const handlePopState = () => {
  //     if (backUrl) {
  //       router.push(backUrl); // Next.js 라우터 이동
  //       setBackUrl(null);
  //     } else {
  //       router.push(`/studyPage?date=${date}`);
  //     }
  //   };

  //   window.history.pushState(null, "", window.location.href);
  //   window.addEventListener("popstate", handlePopState);

  //   return () => {
  //     window.removeEventListener("popstate", handlePopState);
  //   };
  // }, [backUrl]);

  const studyData =
    isPassedDate || isPassedSolo
      ? studyPassedData && studyPassedData[studyType]
      : studySet && studySet[studyType];

  const participationsSet =
    studyType === "participations" && (studyData as StudyParticipationsSetProps[]);
  const confirmedSet = studyType !== "participations" && (studyData as StudyConfirmedSetProps[]);

  const findStudy =
    studyType !== "participations" &&
    confirmedSet?.find((set) => set.study.place._id === id)?.study;

  const myBelong = userInfo?.belong;

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
          ?.study?.find((who) => who.user._id === userInfo?._id);

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

  const members2 =
    studyType === "participations"
      ? shortenParticipations(participationsSet)
      : studyType === "soloRealTimes"
      ? (studyData as StudyConfirmedSetProps[])?.map((study) => ({
          ...study.study.members[0],
        }))
      : findStudy?.members;

  const members =
    tab === "스터디 크루"
      ? (members2 as StudyParticipationProps[])?.filter(
          (member) => member?.user?.belong === userInfo?.belong,
        )
      : members2;

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

  const isOpenStudy = studyType !== "participations" && studyType !== "soloRealTimes";

  const removeBrackets = (str: string) => str.slice(1, -1);

  const belong = userInfo?.belong ? removeBrackets(userInfo.belong) : null;
  const STUDY_GROUP = {
    "수원/용인": "270",
  };
  console.log(3, belong);
  const groupId = !belong ? null : STUDY_GROUP?.[belong];

  const { data: group } = useGroupIdQuery(groupId, { enabled: !!groupId });
  console.log(141, group, groupId);
  return (
    <>
      {isPassedSolo || studyPassedData || studySet ? (
        <>
          <StudyHeader date={date} placeInfo={placeInfo} />
          <Box mb={20}>
            <Slide isNoPadding>
              <StudyCover studyType={studyType} coverImage={placeInfo?.coverImage} />
              <StudyOverview date={date} placeInfo={placeInfo} studyType={studyType} />
              <Divider />
            </Slide>
            <Slide>{isOpenStudy && <StudyAddressMap location={placeInfo?.location} />}</Slide>
            <Slide isNoPadding>
              {isOpenStudy && (
                <Box mt={5}>
                  <Divider />
                </Box>
              )}
              <Box borderBottom="var(--border)" px={5}>
                <TabNav
                  selected={tab}
                  isFullSize
                  isBlack
                  tabOptionsArr={[
                    {
                      text: "일반 스터디",
                      func: () => setTab("일반 스터디"),
                    },
                    {
                      text: "스터디 크루",
                      func: () => {
                        if (!myBelong) {
                          toast("info", "가입중인 스터디 크루가 없습니다.");
                          return;
                        }
                        setTab("스터디 크루");
                      },
                    },
                  ]}
                />
              </Box>
            </Slide>

            <Slide>
              <StudyDateBar
                date={date}
                members={members}
                studyType={studyType}
                placeInfo={placeInfo}
              />
              {isOpenStudy && <StudyTimeBoard members={members as StudyConfirmedMemberProps[]} />}
              <Box h="1px" bg="gray.100" my={4} />
              <Box pb={2} pos="relative">
                {(studyType === "soloRealTimes" || studyType === "participations") && (
                  <StudyDateControl
                    date={dateDayjs}
                    setDate={setDateDayjs}
                    isStudy={studyType === "soloRealTimes"}
                  />
                )}
                <Box minH="240px">
                  {isPassedSolo && !studyPassedData ? (
                    <Box pos="relative" minH="140px">
                      <MainLoadingAbsolute size="sm" />
                    </Box>
                  ) : (
                    <StudyMembers
                      date={dayjsToStr(dateDayjs)}
                      members={members || []}
                      studyType={studyType}
                      // hasStudyLink={
                      //   myStudyStatus === "participation" && studyType !== "soloRealTimes"
                      // }
                    />
                  )}
                </Box>
              </Box>
              {/* {studyType === "participations" && members?.length && (
                  <>
                    <Box h={2} bg="gray.100" my={4} />
                    <StudyNearMemberSection
                      myStudyInfo={myStudyInfo as StudyParticipationProps}
                      members={members as StudyParticipationProps[]}
                    />
                  </>
                )} */}
            </Slide>

            {studyType === "participations" && studySet.results.length ? (
              <>
                <Box h={2} bg="gray.100" my={4} />
                <Slide>
                  <StudyPendingSection studySet={studySet} />
                </Slide>
              </>
            ) : null}
            {studyType === "participations" && tab === "스터디 크루" && group ? (
              <>
                <Box h={2} bg="gray.100" my={4} />
                <Slide>
                  <Box mb={2} fontSize="16px" fontWeight="semibold">
                    연동된 소모임
                  </Box>
                  <GroupThumbnailCard
                    {...createGroupThumbnailProps(group, "pending", null, null, true)}
                  />
                </Slide>
              </>
            ) : null}
            {studyType === "participations" && (
              <StudyPlaceMap
                centerLocation={
                  myStudyInfo
                    ? {
                        lat: (myStudyInfo as StudyParticipationProps).location.latitude,
                        lon: (myStudyInfo as StudyParticipationProps).location.longitude,
                      }
                    : {
                        lat: userInfo?.locationDetail.latitude,
                        lon: userInfo?.locationDetail.longitude,
                      }
                }
              />
            )}

            {placeInfo && studyType === "results" && date === getTodayStr() && (
              <StudyNearMap centerPlace={placeInfo} />
            )}
          </Box>
          {userInfo?.role !== "guest" && (
            <StudyNavigation
              myStudyInfo={myStudyInfo}
              date={isPassedSolo ? dayjsToStr(dateDayjs) : date}
              id={id}
              myStudyStatus={myStudyStatus}
              studyType={studyType}
              location={placeInfo?.location}
              findStudy={findStudy}
              myStudyDateArr={myStudyArr?.map((s) => s?.date)}
              tempCheck={
                !members?.some((member) => member.user._id === userInfo?._id) &&
                studyType === "participations"
              }
            />
          )}
          {date === dayjsToStr(dayjs()) &&
            (studyType === "openRealTimes" || studyType === "results") &&
            (myStudyInfo as StudyConfirmedMemberProps)?.attendance?.type === "arrived" && (
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
