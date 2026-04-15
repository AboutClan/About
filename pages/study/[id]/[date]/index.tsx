import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Divider from "../../../../components/atoms/Divider";
import InfoList from "../../../../components/atoms/lists/InfoList";
import { MainLoading, MainLoadingAbsolute } from "../../../../components/atoms/loaders/MainLoading";
import Slide from "../../../../components/layouts/PageSlide";
import { GroupThumbnailCard } from "../../../../components/molecules/cards/GroupThumbnailCard";
import TabNav from "../../../../components/molecules/navs/TabNav";
import {
  STUDY_CREW_ID_MAPPING,
  STUDY_CREW_PLACE_MAPPING,
} from "../../../../constants/service/study/place";
import { useToast } from "../../../../hooks/custom/CustomToast";
import { useUserInfo } from "../../../../hooks/custom/UserHooks";
import { useGroupIdQuery } from "../../../../hooks/groupStudy/queries";
import { useStudyPassedDayQuery, useStudySetQuery } from "../../../../hooks/study/queries";
import { shortenParticipations } from "../../../../libs/study/studyConverters";
import { getMyStudyDateArr } from "../../../../libs/study/studyHelpers";
import { ModalLayout } from "../../../../modals/Modals";
import StudyLinkModal from "../../../../pageTemplates/study/modals/StudyLinkModal";
import StudyAddressMap from "../../../../pageTemplates/study/StudyAddressMap";
import StudyCover from "../../../../pageTemplates/study/StudyCover";
import StudyDateBar from "../../../../pageTemplates/study/StudyDateBar";
import StudyDateControl from "../../../../pageTemplates/study/StudyDateControl";
import StudyExtraButton from "../../../../pageTemplates/study/StudyExtraButton";
import StudyHeader from "../../../../pageTemplates/study/StudyHeader";
import StudyMembers from "../../../../pageTemplates/study/StudyMembers";
import StudyNavigation from "../../../../pageTemplates/study/StudyNavigation";
import StudyNearMap from "../../../../pageTemplates/study/StudyNearMap";
import StudyOverview from "../../../../pageTemplates/study/StudyOverView";
import StudyPendingSection from "../../../../pageTemplates/study/StudyPendingSection";
import StudyPlaceMap from "../../../../pageTemplates/study/StudyPlaceMap";
import StudyReviewSection from "../../../../pageTemplates/study/StudyReview";
import StudyTimeBoard from "../../../../pageTemplates/study/StudyTimeBoard";
import {
  MyStudyStatus,
  StudyConfirmedMemberProps,
  StudyCrew,
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
  const router = useRouter();

  const toast = useToast();
  const { id, date: date2, type, studyLocation, ticket } = router.query;
  const userInfo = useUserInfo();
  const date = date2 as string;
  const studyType = type as StudyType;

  const [dateDayjs, setDateDayjs] = useState(
    studyType === "soloRealTimes"
      ? dayjs(date)
      : date === dayjsToStr(dayjs()) && getHour() >= 9
      ? dayjs(date).add(1, "day")
      : dayjs(date),
  );
  const [tab, setTab] = useState<"일반 스터디" | "스터디 크루">("일반 스터디");
  const [isTicketModal, setIsTicketModal] = useState(false);

  useEffect(() => {
    if (ticket === "on") {
      const removeParam = (key: string) => {
        const { [key]: _, ...rest } = router.query;
        console.log(_);
        router.replace(
          {
            pathname: router.pathname,
            query: rest,
          },
          undefined,
          { shallow: true },
        );
      };
      setIsTicketModal(true);
      removeParam("ticket");
    }
  }, [ticket]);

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

  const userId = userInfo?._id;

  const getMyStudyInfo = () => {
    switch (studyType) {
      case "soloRealTimes":
        return studySet?.soloRealTimes
          ?.flatMap((solo) => solo.study)
          ?.flatMap((study) => study.members)
          ?.find((member) => member.user._id === userId);

      case "participations":
        return participationsSet
          ?.find((par) => par.study.some((member) => member.user._id === userId))
          ?.study?.find((member) => member.user._id === userId);

      case "openRealTimes":
      case "results":
        return findStudy?.members.find((member) => member.user._id === userId);
    }
  };

  const myStudyInfo = getMyStudyInfo();

  const myStudyArr = getMyStudyDateArr(studySet, userInfo?._id);
  const findTodayStudy = myStudyArr?.filter((myStudy) => myStudy.date === date);

  let myStudyStatus: MyStudyStatus;

  switch (studyType) {
    case "participations": {
      const hasParticipationStudy = shortenParticipations(participationsSet).some(
        (par) => par.user._id === userInfo?._id,
      );
      if (!hasParticipationStudy) {
        myStudyStatus = "pending";
        break;
      }
      myStudyStatus = findTodayStudy?.some((f) => f.type === studyType)
        ? "participation"
        : "otherParticipation";
      break;
    }

    case "soloRealTimes":
    case "openRealTimes":
    case "results": {
      if (!findTodayStudy?.length) {
        myStudyStatus = "pending";
        break;
      }
      myStudyStatus = findTodayStudy.some((f) => f?.placeId === id)
        ? "participation"
        : "otherParticipation";
      break;
    }
  }

  const members2 =
    studyType === "participations"
      ? shortenParticipations(participationsSet)
      : studyType === "soloRealTimes"
      ? (studyData as StudyConfirmedSetProps[])?.map((study) => ({
          ...study.study.members[0],
        }))
      : findStudy?.members;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const entry = Object.entries(STUDY_CREW_PLACE_MAPPING).find(([_, places]) =>
    places.some((s) => s.name === findStudy?.place?.location?.name),
  );

  const crewKey = entry?.[0] as StudyCrew;

  const members =
    tab === "스터디 크루"
      ? (members2 as StudyParticipationProps[])?.filter((member) =>
          crewKey ? member?.user?.belong === crewKey : !!member?.user?.belong,
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

  const groupId = !crewKey ? null : STUDY_CREW_ID_MAPPING?.[crewKey];

  const { data: group } = useGroupIdQuery(groupId, { enabled: !!groupId });

  if (!router.isReady) return null;

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
            <Slide>
              {isOpenStudy && placeInfo?.location && (
                <StudyAddressMap location={placeInfo?.location} />
              )}
            </Slide>
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
                        if (!userInfo?.belong) {
                          toast(
                            "info",
                            "가입중인 스터디 크루가 없습니다. 스터디 소모임에서 가입할 수 있어요!",
                          );
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
              <StudyDateBar date={date} members={members} studyType={studyType} />
              {isOpenStudy && members?.length && (
                <StudyTimeBoard members={members as StudyConfirmedMemberProps[]} />
              )}
              <Box h="1px" bg="gray.100" my={4} />
              <Box pb={2} pos="relative">
                {(studyType === "soloRealTimes" || studyType === "participations") &&
                  tab === "일반 스터디" && (
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
                      isCrew={tab === "스터디 크루"}
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
            {tab === "스터디 크루" && group ? (
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
            ) : null}{" "}
            <Box h={2} bg="gray.100" my={4} />
            <Box mx={5}>
              <Box mb={3} fontSize="16px" fontWeight="semibold">
                {tab === "스터디 크루" ? "스터디 크루 혜택" : "스터디 규칙 안내"}
              </Box>
              {tab === "일반 스터디" ? (
                <InfoList
                  items={[
                    "어바웃 멤버 누구나 자유롭게 신청할 수 있습니다.",
                    "당일 오전 9시에 스터디가 확정됩니다.",
                    "스터디 출석 시 최대 500 Point가 적립됩니다.",
                    "스터디 확정 후 불참은 1,000 Point가 차감됩니다.",
                    "스터디 신청 후 잠수는 2,000 Point가 차감됩니다.",
                    "스터디 당일 참여는 빈자리가 있는 경우에만 가능합니다.",
                    "스터디 종료 후, 멤버 후기 평가를 할 수 있습니다.",
                  ]}
                  isLight
                />
              ) : (
                <InfoList
                  items={[
                    "해당 지역 스터디에 우선 매칭됩니다.",
                    "정원이 마감되어도 추가 참여가 가능합니다.",
                    "스터디 출석 시 [이벤트 뽑기권]이 지급됩니다.",
                    "같은 지역 인원들과 다양한 활동을 할 수 있습니다.",
                  ]}
                  isLight
                />
              )}
            </Box>{" "}
            <Box h={2} bg="gray.100" my={4} />
            {studyType === "participations" && (
              <>
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
                <Box h={5} />
              </>
            )}
            {placeInfo && studyType === "results" && date === getTodayStr() && (
              <>
                <StudyNearMap
                  centerPlace={placeInfo}
                  placeId={placeInfo?._id}
                  defaultLocation={{
                    lat: placeInfo?.location?.latitude,
                    lon: placeInfo?.location?.longitude,
                  }}
                />
                <Box h={2} bg="gray.100" my={4} />
              </>
            )}
            {placeInfo && <StudyReviewSection placeInfo={placeInfo} />}
          </Box>

          <StudyNavigation
            myStudyInfo={myStudyInfo}
            date={isPassedSolo ? dayjsToStr(dateDayjs) : date}
            id={id as string}
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

          {/* {date === dayjsToStr(dayjs()) &&
            (studyType === "openRealTimes" || studyType === "results") &&
            (myStudyInfo as StudyConfirmedMemberProps)?.attendance?.type === "arrived" && (
              <StudyReviewButton
                placeId={placeInfo?._id}
                myStudyInfo={myStudyInfo as StudyConfirmedMemberProps}
              />
            )} */}

          {(studyType === "openRealTimes" || studyType === "results") && (
            <StudyExtraButton myStudyInfo={myStudyInfo as StudyConfirmedMemberProps} />
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
      {isTicketModal && (
        <ModalLayout
          title="열공 뽑기권을 획득했어요!"
          footerOptions={{ main: { text: "확 인" } }}
          isCloseButton={false}
          setIsModal={setIsTicketModal}
        >
          <Box
            position="relative"
            aspectRatio={2 / 1}
            bg="pink"
            w="full"
            borderRadius="12px"
            overflow="hidden"
            border="var(--border)"
            borderColor="#FFEBF3"
          >
            <Image
              src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%9D%B4%EB%B2%A4%ED%8A%B8%EB%A3%B0%EB%A0%9B.png"
              fill
              alt="열공"
            />
          </Box>
        </ModalLayout>
      )}
    </>
  );
}
