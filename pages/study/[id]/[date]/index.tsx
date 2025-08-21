import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams, useSearchParams } from "next/navigation";

import { STUDY_COVER_IMAGES } from "../../../../assets/images/studyCover";
import { MainLoading } from "../../../../components/atoms/loaders/MainLoading";
import Slide from "../../../../components/layouts/PageSlide";
import RightDrawer from "../../../../components/organisms/drawer/RightDrawer";
import StarRatingForm from "../../../../components/organisms/StarRatingForm";
import { useResetStudyQuery } from "../../../../hooks/custom/CustomHooks";
import { usePointToast } from "../../../../hooks/custom/CustomToast";

import { useUserInfo } from "../../../../hooks/custom/UserHooks";
import { usePlaceReviewMutation } from "../../../../hooks/study/mutations";
import { useStudyPassedDayQuery, useStudySetQuery } from "../../../../hooks/study/queries";
import { usePointSystemMutation } from "../../../../hooks/user/mutations";
import { useUserInfoQuery } from "../../../../hooks/user/queries";
import {
  convertStudyToPlaceInfo,
  RealTimesToResultProps,
} from "../../../../libs/study/studyConverters";
import StudyAddressMap from "../../../../pageTemplates/study/StudyAddressMap";
import StudyCover from "../../../../pageTemplates/study/StudyCover";
import StudyDateBar from "../../../../pageTemplates/study/StudyDateBar";
import StudyHeader from "../../../../pageTemplates/study/StudyHeader";
import StudyMembers from "../../../../pageTemplates/study/StudyMembers";
import StudyNavigation from "../../../../pageTemplates/study/StudyNavigation";
import StudyOverview from "../../../../pageTemplates/study/StudyOverView";
import StudyReviewButton from "../../../../pageTemplates/study/StudyReviewButton";
import StudyTimeBoard from "../../../../pageTemplates/study/StudyTimeBoard";
import { CoordinatesProps } from "../../../../types/common";
import { PlaceReviewProps } from "../../../../types/models/studyTypes/entityTypes";
import {
  StudyConfirmedMemberProps,
  StudyConfirmedProps,
} from "../../../../types/models/studyTypes/study-entity.types";
import {
  StudySetEntry,
  StudySetProps,
  StudyType,
} from "../../../../types/models/studyTypes/study-set.types";
import { getTodayStr } from "../../../../utils/dateTimeUtils";
import { getRandomImage } from "../../../../utils/imageUtils";
export interface StudyParticipationUserProps {
  date: string[];
  user: StudyParticipationUserProps;
  coordinates: CoordinatesProps;
}

export default function Page() {
  const searchParams = useSearchParams();
  const { id, date } = useParams<{ id: string; date: string }>() || {};
  const userInfo = useUserInfo();
  const isPassedDate = !!date && dayjs(date).startOf("day").isBefore(dayjs().startOf("day"));

  const studyType = searchParams.get("type") as StudyType;

  const { data: studySet } = useStudySetQuery(date, { enabled: !!date && !isPassedDate });
  const { data: studyPassedData } = useStudyPassedDayQuery(date, {
    enabled: !!isPassedDate,
  });

  const findStudyArr = getTodayStudyArr(studyType, studyPassedData, studySet, date);

  const findStudy = findStudyArr?.find((study) => study?.study?.place._id === id)?.study;

  const placeInfo = convertStudyToPlaceInfo(findStudy, studyType);

  const members: (StudyConfirmedMemberProps | StudyParticipationUserProps)[] = (() => {
    switch (studyType) {
      case "openRealTimes":
      case "results":
        return (findStudy as RealTimesToResultProps | StudyConfirmedProps)?.members ?? [];
      case "participations":
        return getParticipationMembers(studyTypeData as StudySetProps["participations"]);
      case "soloRealTimes":
        return (studyTypeData as StudySetProps["soloRealTimes"])?.map((s) => s.study);
      default:
        return [];
    }
  })();
  const myStudyArr = findStudyArr?.filter((study) =>
    study.study.members.some((member) => member.user._id === userInfo?._id),
  );

  const findMyStudy = members?.find(
    (member: StudyConfirmedMemberProps | StudyParticipationUserProps) =>
      member.user._id === userInfo?._id,
  );

  const hasStudy = [];
  studySet?.openRealTimes
    ?.filter((props) => props.date === getTodayStr())
    .forEach((study) => {
      if (study.study.members.some((member) => member.user._id === userInfo?._id))
        hasStudy.push(study.study.place._id);
    });
  studySet?.participations
    ?.filter((props) => props.date === getTodayStr())
    ?.forEach((par) => {
      if (par.study.user._id === userInfo?._id) {
        hasStudy.push("par");
      }
    });
  studySet?.results
    ?.filter((props) => props.date === getTodayStr())
    ?.forEach((result) => {
      if (result.study.members.some((member) => member.user._id === userInfo?._id)) {
        hasStudy.push(result.study.place._id);
      }
    });
  studySet?.soloRealTimes
    ?.filter((props) => props.date === getTodayStr())
    ?.forEach((study) => {
      if (study?.study.user._id === userInfo?._id) {
        hasStudy.push(study.study.place._id);
      }
    });

  return (
    <>
      {studyPassedData || studySet ? (
        <>
          <StudyHeader date={date} placeInfo={placeInfo} />
          <Box mb={5}>
            <Slide isNoPadding>
              <StudyCover
                coverImage={placeInfo?.coverImage || getRandomImage(STUDY_COVER_IMAGES)}
              />

              <StudyOverview
                date={date}
                placeInfo={placeInfo}
                studyType={type}
                // status={status}
                // time={placeInfo.time}
                isVoting={studySet?.participations?.some(
                  (par) => par.study.user._id === userInfo?._id,
                )}
              />
            </Slide>
            <Box h={2} bg="gray.100" />
            <Slide>
              {studyType !== "participations" && studyType !== "soloRealTimes" && (
                <StudyAddressMap
                  name={placeInfo.name}
                  address={placeInfo.location.address}
                  latitude={placeInfo.location.latitude}
                  longitude={placeInfo.location.longitude}
                />
              )}
              <StudyDateBar date={date} memberCnt={members?.length} studyType={studyType} />
              {studyType !== "participations" && studyType !== "soloRealTimes" && (
                <StudyTimeBoard members={members as StudyConfirmedMemberProps[]} />
              )}
              <Box h="1px" bg="gray.100" my={4} />
              <Box pb={2}>
                <StudyMembers date={date} members={members} studyType={studyType} />
              </Box>
            </Slide>
          </Box>
          {userInfo?.role !== "guest" && (
            <StudyNavigationComponent
              date={date}
              type={type}
              id={id}
              findMyStudy={findMyStudy}
              myStudyArr={myStudyArr}
              hasOtherStudy={findMyStudy ? false : myStudyArr?.length ? true : false}
              locationInfo={
                placeInfo?.latitude
                  ? {
                      lat: placeInfo.latitude,
                      lon: placeInfo.longitude,
                      locationDetail: placeInfo.address,
                      name: placeInfo.name,
                    }
                  : null
              }
            />
          )}
          {isReviewButton && <StudyReviewButton />}

          {/* {isInviteModal && <StudyInviteModal setIsModal={setIsInviteModal} place={place} />} */}
        </>
      ) : (
        <MainLoading />
      )}
    </>
  );
}

function StudyNavigationComponent({
  date,
  type,

  hasOtherStudy,
  id,
  findMyStudy,
  locationInfo,
  myStudyArr,
}: {
  date: string;
  type: StudyTypeStatus;
  hasOtherStudy: boolean;
  id: string;

  locationInfo: {
    lat: number;
    lon: number;
    locationDetail: string;
    name: string;
  };
  findMyStudy: StudyConfirmedMemberProps | StudyParticipationUserProps;
  myStudyArr: (StudyOpenRealTimesSet | StudyResultsSet)[];
}) {
  const myAttendance =
    (findMyStudy as StudyConfirmedMemberProps)?.attendance?.type || "participation";

  if (myAttendance === "arrived" || myAttendance === "absenced") return;

  return (
    <StudyNavigation
      date={date}
      studyType={type}
      hasOtherStudy={hasOtherStudy}
      locationInfo={locationInfo}
      findMyStudy={findMyStudy}
      myStudyArr={myStudyArr}
      // hasOtherStudy={findMyStudy && findMyStudy.place._id !== findStudy?.place?._id}
      id={id}
      // isVoting={!!myVoteInfo || !!myRealTimeStudy}
      // pageType={status}
      // isArrived={!!(myRealTimeStudy?.attendance?.type === "arrived")}
    />
  );
}

const getParticipationMembers = (
  participations: StudySetProps["participations"],
): StudyParticipationUserProps[] => {
  const participationMap = new Map();
  participations?.forEach((data) => {
    if (data) {
      const par = data.study;
      const userId = par.user._id;
      if (participationMap.has(userId)) {
        participationMap.get(userId).date.push(data.date);
      } else {
        participationMap.set(userId, {
          date: [data.date],
          user: par.user,
          coordinates: { lat: par.latitude, lon: par.longitude },
        });
      }
    }
  });
  return Array.from(participationMap.values());
};

function RightReviewDrawer({ placeId, onClose }: { placeId: string; onClose: () => void }) {
  const resetStudy = useResetStudyQuery();
  const pointToast = usePointToast();
  const { data: userInfo } = useUserInfoQuery();

  const { mutate: updatePoint } = usePointSystemMutation("point");
  const { mutate } = usePlaceReviewMutation({
    onSuccess() {
      resetStudy();
      onClose();
    },
  });

  const handleSubmit = (data: PlaceReviewProps) => {
    mutate({ ...data, placeId });
    updatePoint({ value: data.isSecret ? 30 : 100, message: "카페 리뷰 작성" });
    pointToast(data.isSecret ? 30 : 100);
  };

  return (
    <RightDrawer title="카페 후기" onClose={onClose}>
      <Box mt={5}>
        <StarRatingForm user={userInfo} onSubmit={handleSubmit} />
      </Box>
    </RightDrawer>
  );
}

function getTodayStudyArr(
  studyType: StudyType,
  studyPassedData: StudyPassedOneDayProps,
  studySet: StudySetProps,
  date: string,
): StudySetEntry[] {
  if (studyPassedData) {
    if (studyType === "results")
      return studyPassedData.results?.map((result) => ({ date, study: result }));
    else {
      //  const { soloUsers, openUsers } = studyPassedData.realTimes.userList.reduce(
      //     (b, u) => {
      //       if (u.status === "solo") b.soloUsers.push(u);
      //       else b.openUsers.push(u);
      //       return b;
      //     },
      //     {
      //       soloUsers: [] as RealTimeMemberProps[],
      //       openUsers: [] as RealTimeMemberProps[],
      //     },
      // );
      // if (studyType === "openRealTimes") {
      //   return openUsers.map((user)=>({date,study:user}))
      // }
      //   acc.soloRealTimes.push(...soloUsers.map((study) => ({ date, study })));
      //   const openGroups = setRealTimesGroup(openUsers);
      //   acc.openRealTimes.push(...openGroups.map((study) => ({ date, study })));
    }
    if (studyType === "openRealTimes")
      return studyPassedData.realTimes.userList.filter((user) => user.status !== "solo");

    // return studyType === "results"
    //   ? studyPassedData.results?.map((result) => ({ date, study: result }))
    //   :studyType==="openRealTimes"? studyPassedData.realTimes.;
  }

  if (studySet) {
    // studySet["participations"];
    const studyTypeData: StudySetEntry[] = studySet && studySet[studyType];
    return studyTypeData?.filter((s) => s.date === date);
  }

  return null;
}
