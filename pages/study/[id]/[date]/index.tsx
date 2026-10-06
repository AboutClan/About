import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { signIn, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import Divider from "@/components/atoms/Divider";
import InfoList from "@/components/atoms/lists/InfoList";
import { MainLoading, MainLoadingAbsolute } from "@/components/atoms/loaders/MainLoading";
import Slide from "@/components/layouts/PageSlide";
import TabNav from "@/components/molecules/navs/TabNav";
import {
  STUDY_CREW_REGION_LOCATION_MAPPING,
  STUDY_CREW_REGION_SLUG_MAPPING,
  StudyCrewSlug,
} from "@/constants/service/study/place";
import StudyStep from "@/features/gather/screens/detail/StudyStep";
import { useStudyPassedDayQuery, useStudySetQuery } from "@/features/study/hooks/queries";
import { shortenParticipations } from "@/features/study/lib/studyConverters";
import { getMyStudyDateArr } from "@/features/study/lib/studyHelpers";
import StudyLinkModal from "@/features/study/screens/modals/StudyLinkModal";
import StudyAddressMap from "@/features/study/screens/StudyAddressMap";
import StudyCover from "@/features/study/screens/StudyCover";
import StudyExtraButton from "@/features/study/screens/StudyExtraButton";
import StudyHeader from "@/features/study/screens/StudyHeader";
import StudyMembers, { StudyMembersHandle } from "@/features/study/screens/StudyMembers";
import StudyNavigation from "@/features/study/screens/StudyNavigation";
import StudyNearMap from "@/features/study/screens/StudyNearMap";
import StudyOverview from "@/features/study/screens/StudyOverView";
import StudyPlaceMap from "@/features/study/screens/StudyPlaceMap";
import StudyRegionMembers from "@/features/study/screens/StudyRegionMembers";
import StudyReviewSection from "@/features/study/screens/StudyReview";
import StudyTimeBoard from "@/features/study/screens/StudyTimeBoard";
import { useToast } from "@/hooks/custom/CustomToast";
import { useUserInfo } from "@/hooks/custom/UserHooks";
import {
  MyStudyStatus,
  StudyConfirmedMemberProps,
  StudyParticipationProps,
} from "@/types/models/studyTypes/study-entity.types";
import {
  StudyConfirmedSetProps,
  StudyParticipationsSetProps,
  StudyType,
} from "@/types/models/studyTypes/study-set.types";
import { setAuthIntent } from "@/utils/authIntentUtils";
import { dayjsToStr, getTodayStr } from "@/utils/dateTimeUtils";

export default function Page() {
  const router = useRouter();

  const toast = useToast();
  const { id, date: date2, type, studyLocation, from, crew } = router.query;
  const userInfo = useUserInfo();
  // 화면 표시(이름 마스킹·링크 막기)는 게스트도 카공지도와 같게 다룬다.
  const isCafeMap = from === "cafe-map" || userInfo?.role === "guest";
  // 안내·하단 버튼은 실제로 카공지도에서 들어온 경우에만 숨긴다. 예전에는 게스트도 여기에 걸려
  // 진행 방식·규칙 안내·신청 버튼이 모두 사라져, 라운지를 눌러 들어온 게스트가 할 수 있는 게 없었다.
  const isFromCafeMap = from === "cafe-map";
  const date = date2 as string;
  const studyType = type as StudyType;

  const crewSlug =
    typeof crew === "string" && crew in STUDY_CREW_REGION_SLUG_MAPPING
      ? (crew as StudyCrewSlug)
      : null;
  const crewFixedLocation = crewSlug
    ? STUDY_CREW_REGION_LOCATION_MAPPING[STUDY_CREW_REGION_SLUG_MAPPING[crewSlug]]
    : null;

  // const [dateDayjs, setDateDayjs] = useState(
  //   studyType === "soloRealTimes"
  //     ? dayjs(date)
  //     : date === dayjsToStr(dayjs()) && getHour() >= 9
  //     ? dayjs(date).add(1, "day")
  //     : dayjs(date),
  // );
  // 두 번째 탭은 예전 "스터디 크루"를 대신하는 "지역 멤버"(StudyRegionMembers)다.
  const [tab, setTab] = useState<"일반 스터디" | "지역 멤버">("일반 스터디");
  const studyMembersRef = useRef<StudyMembersHandle>(null);
  // const [isTicketModal, setIsTicketModal] = useState(false);

  // useEffect(() => {
  //   if (ticket === "on") {
  //     const removeParam = (key: string) => {
  //       const { [key]: _, ...rest } = router.query;
  //       router.replace(
  //         {
  //           pathname: router.pathname,
  //           query: rest,
  //         },
  //         undefined,
  //         { shallow: true },
  //       );
  //     };
  //     setIsTicketModal(true);
  //     removeParam("ticket");
  //   }
  // }, [ticket]);

  const isPassedDate =
    studyType !== "soloRealTimes" &&
    !!date &&
    dayjs(date).startOf("day").isBefore(dayjs().startOf("day"));
  const isPassedSolo =
    studyType === "soloRealTimes" && dayjs(date).isBefore(dayjs().startOf("day"));

  const { data: studySet } = useStudySetQuery(
    studyType === "participations" ? dayjsToStr(dayjs()) : date,
    { enabled: !!date && !isPassedDate },
  );

  const { data: studyPassedData } = useStudyPassedDayQuery(date, {
    enabled: !!isPassedDate || !!isPassedSolo,
  });

  const [modalType, setModalType] = useState<"studyLink" | "review">();

  useEffect(() => {
    if (studyLocation === "true") {
      setTab("지역 멤버");
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
      ? // 라운지는 매칭 신청자만 보여 준다(첫 화면 라운지 카드와 같은 기준). 직접 개설 멤버는 신청자가 아니다.
        shortenParticipations(participationsSet)
      : studyType === "soloRealTimes"
        ? (studyData as StudyConfirmedSetProps[])?.map((study) => ({
            ...study.study.members[0],
          }))
        : findStudy?.members;

  const isParticipations = studyType === "participations";

  const members = members2;
  const isRegionTab = tab === "지역 멤버";

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
  // 오픈 예정 조(내일 이후 매칭 미리보기). 아직 열리지 않았으니 진행 방식은 숨기고 리뷰는 아래로 내린다.
  const isExpectedStudy = studyType === "results" && dayjs(date).isAfter(dayjs(), "day");

  if (!router.isReady) return null;

  if (crewFixedLocation && userInfo && userInfo.role === "guest") {
    return <StudyCrewLoginRequired />;
  }

  return (
    <>
      {isPassedSolo || studyPassedData || studySet ? (
        <>
          <StudyHeader
            date={date}
            placeInfo={placeInfo}
            studyType={studyType}
            onSaveImage={() => studyMembersRef.current?.saveImage()}
          />
          <Box mb="92px">
            <Slide isNoPadding>
              <StudyCover studyType={studyType} coverImage={placeInfo?.coverImage} />
              <StudyOverview
                date={date}
                placeInfo={placeInfo}
                studyType={studyType}
                members={findStudy ? findStudy.members : undefined}
              />
              <Divider />
            </Slide>
            <Slide>
              {isOpenStudy && placeInfo?.location && (
                <StudyAddressMap location={placeInfo?.location} />
              )}
            </Slide>
            <Slide isNoPadding>
              {/* 지역 멤버 탭은 라운지(신청 단계)에서만. 장소 조 상세에서는 조 멤버만 본다. */}
              {isParticipations && (
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
                        text: "지역 멤버",
                        func: () => setTab("지역 멤버"),
                      },
                    ]}
                  />
                </Box>
              )}
            </Slide>
            <Slide>
              {isRegionTab && isParticipations ? (
                <Box pt={5} pb={2}>
                  <StudyRegionMembers isCafeMap={isCafeMap} />
                </Box>
              ) : (
                <>
                  {/* <StudyDateBar
                    date={date}
                    members={members}
                    studyType={studyType}
                    isCrew={tab === "스터디 크루"}
                  /> */}
                  {isOpenStudy && !!members?.length && (
                    <Box pt={5}>
                      <Box fontSize="16px" fontWeight="bold" mb={3}>
                        멤버 시간
                      </Box>
                      <StudyTimeBoard
                        members={members as StudyConfirmedMemberProps[]}
                        isCafeMap={isCafeMap}
                      />
                    </Box>
                  )}
                  <Box h="1px" bg="gray.100" my={4} />
                  {/* 장소 조는 탭이 없어 목록 제목을 따로 둔다. */}
                  {isOpenStudy && !!members?.length && (
                    <Box fontSize="16px" fontWeight="bold" mt={5}>
                      {isExpectedStudy ? "신청 멤버" : "참여 멤버"} {members.length}명
                    </Box>
                  )}
                  <Box pb={2} pos="relative">
                    {/* {(studyType === "soloRealTimes" || studyType === "participations") &&
                      tab === "일반 스터디" && (
                        <StudyDateControl
                          date={dateDayjs}
                          setDate={setDateDayjs}
                          isStudy={studyType === "soloRealTimes"}
                        />
                      )} */}

                    {/* 장소 조는 인원이 적어 최소 높이를 두면 아래가 크게 빈다. */}
                    <Box minH={isOpenStudy ? undefined : "240px"}>
                      {isPassedSolo && !studyPassedData ? (
                        <Box pos="relative" minH="140px">
                          <MainLoadingAbsolute size="sm" />
                        </Box>
                      ) : (
                        <StudyMembers
                          ref={studyMembersRef}
                          date={date}
                          members={members || []}
                          studyType={studyType}
                          isCrew={false}
                          coordinates={{
                            lat: placeInfo?.location.latitude,
                            lon: placeInfo?.location?.longitude,
                          }}
                          isCafeMap={isCafeMap}
                          pendingResultsSet={
                            studyType === "participations" ? studySet?.results : null
                          }
                          crewMemberIds={null}
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
                </>
              )}
            </Slide>
            {!isFromCafeMap && !isExpectedStudy && (
              <>
                <Box h={2} bg="gray.100" my={4} />
                <Slide>
                  <Box fontSize="16px" mb={3} mt={4} fontWeight="bold">
                    스터디 진행 방식
                  </Box>
                  <StudyStep />
                </Slide>
              </>
            )}
            {/* 오픈 예정 조는 바로 아래 규칙 안내가 자기 구분선을 가진다(두 줄 겹침 방지). */}
            {!isExpectedStudy && <Box h={2} bg="gray.100" my={4} />}
            {studyType === "participations" && (
              <>
                <StudyPlaceMap
                  // 신청했으면 내 신청 위치, 아니면 지도가 현재 위치·회원 위치로 잡는다.
                  centerLocation={
                    (myStudyInfo as StudyParticipationProps)?.location?.latitude
                      ? {
                          lat: (myStudyInfo as StudyParticipationProps).location.latitude,
                          lon: (myStudyInfo as StudyParticipationProps).location.longitude,
                        }
                      : null
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
            {placeInfo && studyType === "results" && !isExpectedStudy && (
              <StudyReviewSection
                placeInfo={placeInfo}
                isArrived={
                  (myStudyInfo as StudyConfirmedMemberProps)?.attendance?.type === "arrived"
                }
              />
            )}
            {!isFromCafeMap && (
              <>
                <Box h={2} bg="gray.100" mb={4} />
                <Box mx={5}>
                  <Box mb={3} fontSize="16px" fontWeight="semibold">
                    스터디 규칙 안내
                  </Box>
                  <InfoList
                    items={[
                      // 값은 서버 CONSTANTS.ts(STUDY_ATTEND_BEFORE·STUDY_ABSENCE_*·ABSENCE_FEE)와 맞춘다.
                      "어바웃 멤버 누구나 자유롭게 신청할 수 있습니다.",
                      "당일 오전 9시, 가까운 멤버가 4명 이상 모이면 확정됩니다.",
                      // InfoList는 줄바꿈을 막는다(공용). 한 줄에 들어가게 짧게 쓴다.
                      "스터디 출석 시 100~1,000 Point가 랜덤으로 적립됩니다.",
                      "확정 후 불참 신고 시 1,000~2,000 Point (늦을수록 증가)",
                      "확정 후 연락 없이 불참하면 2,000 Point가 차감됩니다.",
                      // 확정 이후 이야기라 오픈 예정 조에서는 뺀다.
                      ...(isExpectedStudy
                        ? []
                        : ["스터디 당일 참여는 빈자리가 있는 경우에만 가능합니다."]),
                    ]}
                    isLight
                  />
                </Box>
              </>
            )}
            {placeInfo && isExpectedStudy && (
              <>
                <Box h={2} bg="gray.100" my={4} />
                <StudyReviewSection
                  placeInfo={placeInfo}
                  isArrived={
                    (myStudyInfo as StudyConfirmedMemberProps)?.attendance?.type === "arrived"
                  }
                  isReadOnly
                />
              </>
            )}
          </Box>

          <StudyNavigation
            myStudyInfo={myStudyInfo}
            date={date}
            id={id as string}
            myStudyStatus={myStudyStatus}
            studyType={studyType}
            location={crewFixedLocation || placeInfo?.location}
            findStudy={findStudy}
            myStudyDateArr={myStudyArr?.map((s) => s?.date)}
            tempCheck={
              isParticipations &&
              !(members2 as StudyParticipationProps[])?.some(
                (member) => member.user._id === userInfo?._id,
              )
            }
            // 게스트는 하단 버튼을 눌러 가입 안내를 받는다(카공지도에서 온 경우만 버튼을 숨긴다).
            isCafeMap={isFromCafeMap}
          />

          {/* {date === dayjsToStr(dayjs()) &&
            (studyType === "openRealTimes" || studyType === "results") &&
            (myStudyInfo as StudyConfirmedMemberProps)?.attendance?.type === "arrived" && (
              <StudyReviewButton
                placeId={placeInfo?._id}
                myStudyInfo={myStudyInfo as StudyConfirmedMemberProps}
              />
            )} */}

          {(studyType === "openRealTimes" || studyType === "results") && !isCafeMap && (
            <StudyExtraButton myStudyInfo={myStudyInfo as StudyConfirmedMemberProps} />
          )}

          {/* {isInviteModal && <StudyInviteModal setIsModal={setIsInviteModal} place={place} />} */}
        </>
      ) : (
        <MainLoading />
      )}
      {modalType === "studyLink" && (
        <StudyLinkModal
          studyType={studyType}
          date={date}
          onClose={() => setModalType(null)}
          coordinates={{ lat: placeInfo?.location.latitude, lon: placeInfo?.location.longitude }}
        />
      )}
      {studyType === "participations" && <Box h={5} />}
    </>
  );
}

function StudyCrewLoginRequired() {
  const handleLogin = async () => {
    setAuthIntent();
    await signOut({ redirect: false });
    await signIn("kakao", { callbackUrl: window.location.href });
  };

  return (
    <Flex direction="column" align="center" justify="center" h="100dvh" px={5} textAlign="center">
      <Box fontSize="18px" fontWeight="bold" mb={2}>
        로그인이 필요해요
      </Box>
      <Box color="gray.600" mb={6} fontSize="14px">
        스터디 크루 신청을 위해 로그인이 필요합니다.
      </Box>
      <Button colorScheme="mint" size="lg" w="full" maxW="320px" onClick={handleLogin}>
        카카오로 로그인하기
      </Button>
    </Flex>
  );
}
