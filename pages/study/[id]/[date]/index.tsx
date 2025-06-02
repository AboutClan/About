import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { STUDY_COVER_IMAGES } from "../../../../assets/images/studyCover";
import { STUDY_MAIN_IMAGES } from "../../../../assets/images/studyMain";
import { MainLoading } from "../../../../components/atoms/loaders/MainLoading";
import Slide from "../../../../components/layouts/PageSlide";
import RightDrawer from "../../../../components/organisms/drawer/RightDrawer";
import StarRatingForm from "../../../../components/organisms/StarRatingForm";
import { useUserCurrentLocation } from "../../../../hooks/custom/CurrentLocationHook";
import { useResetStudyQuery } from "../../../../hooks/custom/CustomHooks";
import { usePointToast } from "../../../../hooks/custom/CustomToast";
import { usePlaceReviewMutation } from "../../../../hooks/study/mutations";
import { useStudyVoteQuery } from "../../../../hooks/study/queries";
import { usePointSystemMutation } from "../../../../hooks/user/mutations";
import { useUserInfoQuery } from "../../../../hooks/user/queries";
import { convertMergePlaceToPlace } from "../../../../libs/study/studyConverters";
import {
  findMyStudyByUserId,
  findMyStudyInfo,
  findStudyByPlaceId,
} from "../../../../libs/study/studySelectors";
import StudyAddressMap from "../../../../pageTemplates/study/StudyAddressMap";
import StudyCover from "../../../../pageTemplates/study/StudyCover";
import StudyDateBar from "../../../../pageTemplates/study/StudyDateBar";
import StudyHeader from "../../../../pageTemplates/study/StudyHeader";
import StudyMembers from "../../../../pageTemplates/study/StudyMembers";
import StudyNavigation from "../../../../pageTemplates/study/StudyNavigation";
import StudyOverview from "../../../../pageTemplates/study/StudyOverView";
import StudyTimeBoard from "../../../../pageTemplates/study/StudyTimeBoard";
import { StudyMemberProps } from "../../../../types/models/studyTypes/baseTypes";
import { PlaceReviewProps } from "../../../../types/models/studyTypes/entityTypes";
import { UserSimpleInfoProps } from "../../../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../../../utils/dateTimeUtils";
import { getDistanceFromLatLonInKm, getRandomIdx } from "../../../../utils/mathUtils";
import { iPhoneNotchSize } from "../../../../utils/validationUtils";

export default function Page() {
  const { data: session } = useSession();
  const { id, date } = useParams<{ id: string; date: string }>() || {};
  const { currentLocation } = useUserCurrentLocation();
  const isGuest = session?.user.role === "guest";

  const isParticipationPage = id === "participations";
  const isRealTimePage = id === "realTime";

  const { data: studyVoteData } = useStudyVoteQuery(date, {
    enabled: !!date,
  });
  console.log(studyVoteData);
  const [isReviewModal, setIsReviewModal] = useState(false);
  const [isReviewButton, setIsReviewButton] = useState(false);

  const isExpectedPage = !!(id !== "participations" && studyVoteData?.participations);

  const findStudy =
    studyVoteData && id !== "participations" && findStudyByPlaceId(studyVoteData, id);
  const findMyStudy = findMyStudyByUserId(studyVoteData, session?.user.id);

  const myStudy = findMyStudyInfo(findStudy, session?.user.id);

  const placeInfo =
    convertMergePlaceToPlace(findStudy?.place) ||
    (isParticipationPage
      ? {
          name: "스터디 매칭 대기소",
          branch: "About",
          address: "위치 선정 중",
          brand: "",
          image: STUDY_MAIN_IMAGES[getRandomIdx(STUDY_COVER_IMAGES.length - 1)],
          coverImage: STUDY_COVER_IMAGES[getRandomIdx(STUDY_COVER_IMAGES.length - 1)],

          latitude: null,
          longitude: null,
          time: dayjsToFormat(dayjs(date), "M월 D일 오전 9시"),
          _id: null,
          reviews: [],
        }
      : {
          name: "개인 스터디 인증",
          branch: "About",
          address: "자유 카페 / 스터디 카페",
          brand: "",
          image: STUDY_MAIN_IMAGES[getRandomIdx(STUDY_COVER_IMAGES.length - 1)],
          coverImage: STUDY_COVER_IMAGES[getRandomIdx(STUDY_COVER_IMAGES.length - 1)],

          latitude: null,
          longitude: null,
          time: "하루 공부가 끝나는 순간까지",

          _id: null,
          reviews: [],
        });

  const distance =
    currentLocation &&
    getDistanceFromLatLonInKm(
      currentLocation.lat,
      currentLocation.lon,
      placeInfo.latitude,
      placeInfo.longitude,
    );

  const members: StudyMemberProps[] | { user: UserSimpleInfoProps }[] =
    findStudy?.members ||
    (isParticipationPage
      ? studyVoteData?.participations?.map((par) => ({
          user: par.user,
          lat: par.latitude,
          lon: par.longitude,
        }))
      : isRealTimePage
      ? studyVoteData?.realTimes.userList
      : null);

  // const absences = studyVoteData?.participations.find((par) => par.place._id === id)?.absences;

  const myVoteInfo = studyVoteData?.participations?.find(
    (who) => who.user._id === session?.user.id,
  );

  const status =
    findStudy?.status ||
    (isParticipationPage
      ? "recruiting"
      : isExpectedPage
      ? "expected"
      : isRealTimePage
      ? "solo"
      : null);

  const myRealTimeStudy = findMyStudy?.members.find((who) => who.user._id === session?.user.id);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (findStudy?.status === "open") {
      timeoutId = setTimeout(() => {
        setIsReviewButton(true);
      }, 400);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [findStudy]);

  return (
    <>
      {studyVoteData ? (
        <>
          <StudyHeader date={date} placeInfo={placeInfo} />
          <Box mb={5}>
            <Slide isNoPadding>
              <StudyCover coverImage={placeInfo.coverImage} />
              <StudyOverview
                place={{ ...placeInfo }}
                distance={distance}
                status={status}
                time={placeInfo.time}
                isVoting={!!myVoteInfo || !!myRealTimeStudy}
              />
            </Slide>
            <Box h={2} bg="gray.100" />
            <Slide>
              {!isParticipationPage && !isRealTimePage && (
                <StudyAddressMap
                  name={placeInfo.name}
                  address={placeInfo.address}
                  latitude={placeInfo.latitude}
                  longitude={placeInfo.longitude}
                />
              )}
              <StudyDateBar
                date={date}
                memberCnt={members?.length}
                isParticipationPage={isParticipationPage}
              />
              {id !== "participations" && !isRealTimePage && (
                <StudyTimeBoard members={members as StudyMemberProps[]} />
              )}
              <Box h="1px" bg="gray.100" my={4} />
              <Box pb={2}>
                <StudyMembers
                  date={date}
                  members={members}
                  status={findStudy?.status || (isParticipationPage ? "recruiting" : "solo")}
                />
              </Box>
            </Slide>
          </Box>
          {(findStudy || isParticipationPage || isRealTimePage) && !isGuest && (
            <StudyNavigation
              date={date}
              findStudy={findStudy}
              hasOtherStudy={findMyStudy && findMyStudy.place._id !== findStudy?.place?._id}
              id={id}
              isVoting={!!myVoteInfo || !!myRealTimeStudy}
              pageType={status}
              isArrived={!!(myRealTimeStudy?.attendance?.type === "arrived")}
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
                isDisabled={
                  !(
                    myStudy?.attendance?.type === "arrived" &&
                    !findMyStudy?.place?.reviews.some(
                      (review) => review?.user?._id === session?.user.id,
                    )
                  )
                }
                onClick={() => setIsReviewModal(true)}
                _hover={{
                  background: undefined,
                }}
              >
                {findMyStudy?.place?.reviews.some(
                  (review) => review?.user?._id === session?.user.id,
                )
                  ? "작성 완료"
                  : "카페 리뷰"}
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
