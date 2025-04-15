import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { STUDY_COVER_IMAGES } from "../../../../assets/images/studyCover";
import { STUDY_MAIN_IMAGES } from "../../../../assets/images/studyMain";
import { MainLoading } from "../../../../components/atoms/loaders/MainLoading";
import Slide from "../../../../components/layouts/PageSlide";
import { useUserCurrentLocation } from "../../../../hooks/custom/CurrentLocationHook";
import { useStudyVoteQuery } from "../../../../hooks/study/queries";
import { convertMergePlaceToPlace } from "../../../../libs/study/studyConverters";
import { findMyStudyByUserId, findStudyByPlaceId } from "../../../../libs/study/studySelectors";
import StudyAddressMap from "../../../../pageTemplates/study/StudyAddressMap";
import StudyCover from "../../../../pageTemplates/study/StudyCover";
import StudyDateBar from "../../../../pageTemplates/study/StudyDateBar";
import StudyHeader from "../../../../pageTemplates/study/StudyHeader";
import StudyMembers from "../../../../pageTemplates/study/StudyMembers";
import StudyNavigation from "../../../../pageTemplates/study/StudyNavigation";
import StudyOverview from "../../../../pageTemplates/study/StudyOverView";
import StudyTimeBoard from "../../../../pageTemplates/study/StudyTimeBoard";
import { StudyMemberProps } from "../../../../types/models/studyTypes/baseTypes";
import { UserSimpleInfoProps } from "../../../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../../../utils/dateTimeUtils";
import { getDistanceFromLatLonInKm, getRandomIdx } from "../../../../utils/mathUtils";

export default function Page() {
  const { data: session } = useSession();
  const { id, date } = useParams<{ id: string; date: string }>() || {};
  const { currentLocation } = useUserCurrentLocation();

  const isParticipationPage = id === "participations";

  const { data: studyVoteData } = useStudyVoteQuery(date, {
    enabled: !!date,
  });

  const findStudy =
    studyVoteData && id !== "participations" && findStudyByPlaceId(studyVoteData, id);

  const findMyStudy = findMyStudyByUserId(studyVoteData, session?.user.id);

  const placeInfo = convertMergePlaceToPlace(findStudy?.place) || {
    name: "스터디 매칭 대기소",
    branch: "About",
    address: "위치 선정 중",
    brand: "",
    image: STUDY_MAIN_IMAGES[getRandomIdx(STUDY_COVER_IMAGES.length - 1)],
    coverImage: STUDY_COVER_IMAGES[getRandomIdx(STUDY_COVER_IMAGES.length - 1)],

    latitude: null,
    longitude: null,
    time: dayjsToFormat(dayjs(date), "M월 D일 오후 10시"),

    _id: null,
  };

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
    studyVoteData?.participations?.map((par) => ({
      user: par.user,
      lat: par.latitude,
      lon: par.longitude,
    }));

  // const absences = studyVoteData?.participations.find((par) => par.place._id === id)?.absences;

  const myVoteInfo = studyVoteData?.participations?.find(
    (who) => who.user._id === session?.user.id,
  );

  return (
    <>
      {studyVoteData ? (
        <>
          <StudyHeader placeInfo={placeInfo} />
          <Box mb={5}>
            <Slide isNoPadding>
              <StudyCover coverImage={placeInfo.coverImage} />
              <StudyOverview
                place={{ ...placeInfo }}
                distance={distance}
                status={findStudy?.status || "recruiting"}
                time={placeInfo.time}
              />
            </Slide>
            <Box h={2} bg="gray.100" />
            <Slide>
              {!isParticipationPage && (
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
              {id !== "participations" && (
                <StudyTimeBoard members={members as StudyMemberProps[]} />
              )}
              <Box h="1px" bg="gray.100" my={4} />
              <Box pb={2}>
                <StudyMembers
                  date={date}
                  members={members}
                  status={findStudy?.status || "recruiting"}
                />
              </Box>
            </Slide>
          </Box>
          {(findStudy || id === "participations") && (
            <StudyNavigation
              date={date}
              findStudy={findStudy}
              hasOtherStudy={findMyStudy && findMyStudy.place._id !== findStudy?.place?._id}
              id={id}
              isVoting={!!myVoteInfo}
            />
          )}
          {/* {isInviteModal && <StudyInviteModal setIsModal={setIsInviteModal} place={place} />} */}
        </>
      ) : (
        <MainLoading />
      )}
    </>
  );
}
