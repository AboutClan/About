import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { MainLoading } from "../../../../components/atoms/loaders/MainLoading";
import Slide from "../../../../components/layouts/PageSlide";
import RightDrawer from "../../../../components/organisms/drawer/RightDrawer";
import StarRatingForm from "../../../../components/organisms/StarRatingForm";
import { useResetStudyQuery } from "../../../../hooks/custom/CustomHooks";
import { usePointToast } from "../../../../hooks/custom/CustomToast";
import { useStudySetQuery } from "../../../../hooks/custom/StudyHooks";
import { usePlaceReviewMutation } from "../../../../hooks/study/mutations";
import { useStudyVoteQuery } from "../../../../hooks/study/queries";
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
import StudyTimeBoard from "../../../../pageTemplates/study/StudyTimeBoard";
import { CoordinatesProps } from "../../../../types/common";
import {
  ParticipationUser,
  StudyMemberProps,
  StudyResultProps,
} from "../../../../types/models/studyTypes/baseTypes";
import {
  StudyOpenRealTimesSet,
  StudyResultsSet,
  StudySetProps,
  StudyStatus,
} from "../../../../types/models/studyTypes/derivedTypes";
import { PlaceReviewProps } from "../../../../types/models/studyTypes/entityTypes";
import { iPhoneNotchSize } from "../../../../utils/validationUtils";
export interface StudyParticipationUserProps {
  date: string[];
  user: ParticipationUser;
  coordinates: CoordinatesProps;
}

export type StudyTypeStatus =
  | "participations"
  | "soloRealTimes"
  | "openRealTimes"
  | "expectedResult"
  | "voteResult";

export type StudyType = "participations" | "soloRealTimes" | "openRealTimes" | "results";

export type StudySetItem = StudySetProps[keyof StudySetProps][number];

export default function Page() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { id, date } = useParams<{ id: string; date: string }>() || {};

  const isGuest = session?.user.role === "guest";
  const type = searchParams.get("type") as StudyTypeStatus;

  const todayStart = dayjs().startOf("day");
  const dateStart = date ? dayjs(date).startOf("day") : null;

  const isPassedDate = !!dateStart && dateStart.isBefore(todayStart);

  const { data: userInfo } = useUserInfoQuery();
  const { data: studyVoteData } = useStudyVoteQuery(date, {
    enabled: !!date && !!isPassedDate,
  });

  const { studySet } = useStudySetQuery(date, !!date && !isPassedDate);

  const studyType: StudyStatus =
    type === "expectedResult" || type === "voteResult" ? "results" : type;

  const studyData: StudySetItem[] = studySet && studySet[studyType];

  const [isReviewModal, setIsReviewModal] = useState(false);
  const [isReviewButton, setIsReviewButton] = useState(false);

  const findStudyArr =
    studyType === "results" || studyType === "openRealTimes"
      ? (studyData?.filter((study) => study.date === date) as (
          | StudyOpenRealTimesSet
          | StudyResultsSet
        )[])
      : null;

  const findStudy = findStudyArr?.find((study) => study?.study?.place._id === id)?.study;

  const placeInfo = convertStudyToPlaceInfo(findStudy, studyType);

  const members: (StudyMemberProps | StudyParticipationUserProps)[] = (() => {
    switch (studyType) {
      case "openRealTimes":
      case "results":
        return (findStudy as RealTimesToResultProps | StudyResultProps)?.members ?? [];
      case "participations":
        return getParticipationMembers(studyData as StudySetProps["participations"]);
      case "soloRealTimes":
        return (studyData as StudySetProps["soloRealTimes"])?.map((s) => s.study);
      default:
        return [];
    }
  })();

  const myStudyArr = findStudyArr?.filter((study) =>
    study.study.members.some((member) => member.user._id === userInfo?._id),
  );
  console.log(55, myStudyArr);
  const findMyStudy = members?.find(
    (member: StudyMemberProps | StudyParticipationUserProps) => member.user._id === userInfo?._id,
  );

  return (
    <>
      {studyVoteData || studySet ? (
        <>
          <StudyHeader date={date} placeInfo={placeInfo} />
          <Box mb={5}>
            <Slide isNoPadding>
              <StudyCover coverImage={placeInfo.coverImage} />

              <StudyOverview
                date={date}
                placeInfo={placeInfo}
                studyType={type}
                // status={status}
                time={placeInfo.time}
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
                  address={placeInfo.address}
                  latitude={placeInfo.latitude}
                  longitude={placeInfo.longitude}
                />
              )}
              <StudyDateBar date={date} memberCnt={members?.length} studyType={studyType} />
              {studyType !== "participations" && studyType !== "soloRealTimes" && (
                <StudyTimeBoard members={members as StudyMemberProps[]} />
              )}
              <Box h="1px" bg="gray.100" my={4} />
              <Box pb={2}>
                <StudyMembers date={date} members={members} studyType={studyType} />
              </Box>
            </Slide>
          </Box>
          {!isGuest && (
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
          {isReviewButton && (
            <Flex
              position="fixed"
              zIndex="800"
              fontSize="12px"
              lineHeight="24px"
              fontWeight={700}
              bottom={`calc(var(--bottom-nav-height) + ${iPhoneNotchSize() + 20}px)`}
              right="20px"
            >
              <Button
                fontSize="12px"
                h="40px"
                color="white"
                px={4}
                borderRadius="20px"
                lineHeight="24px"
                iconSpacing={1}
                colorScheme="black"
                rightIcon={<PencilIcon />}
                // isDisabled={
                //   !(
                //     myStudy?.attendance?.type === "arrived" &&
                //     !findMyStudy?.place?.reviews.some(
                //       (review) => review?.user?._id === session?.user.id,
                //     )
                //   )
                // }
                onClick={() => setIsReviewModal(true)}
                _hover={{
                  background: undefined,
                }}
              >
                {/* {findMyStudy?.place?.reviews.some(
                  (review) => review?.user?._id === session?.user.id,
                )
                  ? "작성 완료"
                  : "카페 리뷰"} */}
              </Button>
            </Flex>
          )}
          {isReviewModal && (
            <RightReviewDrawer placeId={placeInfo._id} onClose={() => setIsReviewModal(false)} />
          )}
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
  findMyStudy: StudyMemberProps | StudyParticipationUserProps;
  myStudyArr: (StudyOpenRealTimesSet | StudyResultsSet)[];
}) {
  const myAttendance = (findMyStudy as StudyMemberProps)?.attendance?.type || "participation";

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

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="12px"
      viewBox="0 -960 960 960"
      width="12px"
      fill="white"
    >
      <path d="M168-121q-21 5-36.5-10.5T121-168l35-170 182 182-170 35Zm235-84L205-403l413-413q23-23 57-23t57 23l84 84q23 23 23 57t-23 57L403-205Z" />
    </svg>
  );
}
