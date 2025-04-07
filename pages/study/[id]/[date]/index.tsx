import { Box } from "@chakra-ui/react";
import { useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import { MainLoading } from "../../../../components/atoms/loaders/MainLoading";
import Slide from "../../../../components/layouts/PageSlide";
import { useUserCurrentLocation } from "../../../../hooks/custom/CurrentLocationHook";
import { useStudyVoteQuery } from "../../../../hooks/study/queries";
import { convertMergePlaceToPlace } from "../../../../libs/study/convertMergePlaceToPlace";
import {
  convertStudyToParticipations,
  getMyStudyInfo,
  getMyStudyParticipation,
} from "../../../../libs/study/getMyStudyMethods";
import StudyInviteModal from "../../../../modals/study/StudyInviteModal";
import StudyAddressMap from "../../../../pageTemplates/study/StudyAddressMap";
import StudyCover from "../../../../pageTemplates/study/StudyCover";
import StudyDateBar from "../../../../pageTemplates/study/StudyDateBar";
import StudyHeader from "../../../../pageTemplates/study/StudyHeader";
import StudyMembers from "../../../../pageTemplates/study/StudyMembers";
import StudyNavigation from "../../../../pageTemplates/study/StudyNavigation";
import StudyOverview from "../../../../pageTemplates/study/StudyOverView";
import StudyTimeBoard from "../../../../pageTemplates/study/StudyTimeBoard";
import { myStudyParticipationState } from "../../../../recoils/studyRecoils";
import { LocationEn } from "../../../../types/services/locationTypes";
import { convertLocationLangTo } from "../../../../utils/convertUtils/convertDatas";
import { getDistanceFromLatLonInKm } from "../../../../utils/mathUtils";

export default function Page() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const isGuest = session?.user.role === "guest";
  const { id, date } = useParams<{ id: string; date: string }>() || {};
  const { currentLocation } = useUserCurrentLocation();

  const locationParam = searchParams.get("location") as LocationEn;
  const setMyStudyParticipation = useSetRecoilState(myStudyParticipationState);
  const [isInviteModal, setIsInviteModal] = useState(false);

  const { data: studyVoteData } = useStudyVoteQuery(
    date,
    convertLocationLangTo(locationParam, "kr"),
    {
      enabled: !!date && !!locationParam,
    },
  );

  useEffect(() => {
    if (!studyVoteData) return;
    const findMyStudyParticipation = getMyStudyParticipation(studyVoteData, session?.user.uid);
    setMyStudyParticipation(findMyStudyParticipation);
  }, [studyVoteData]);

  const mergeParticipations = convertStudyToParticipations(
    studyVoteData,
    convertLocationLangTo(locationParam, "kr"),
    true,
  );
  const mergeParticipation = mergeParticipations?.find(
    (participation) => participation.place._id === id,
  );

  const place = convertMergePlaceToPlace(mergeParticipation?.place);

  const { name, address, coverImage, latitude, brand, longitude, time, type } = place || {};

  const distance =
    currentLocation &&
    getDistanceFromLatLonInKm(currentLocation.lat, currentLocation.lon, latitude, longitude);
  const members = mergeParticipation?.members;

  const absences = studyVoteData?.participations.find((par) => par.place._id === id)?.absences;

  return (
    <>
      {mergeParticipation ? (
        <>
          <StudyHeader brand={brand} name={name} address={address} coverImage={coverImage} />
          <Box mb={5}>
            <Slide isNoPadding>
              <StudyCover coverImage={coverImage} />
              <StudyOverview
                place={{ ...place }}
                distance={distance}
                status={mergeParticipation.status}
                time={time}
              />
            </Slide>
            <Box h={2} bg="gray.100" />
            <Slide>
              <StudyAddressMap
                name={name}
                address={address}
                latitude={latitude}
                longitude={longitude}
              />

              <StudyDateBar date={date} memberCnt={members.length} />
              <StudyTimeBoard members={members} />
              <Box h="1px" bg="gray.100" my={4} />
              <StudyMembers date={date} members={members} absences={absences} />
            </Slide>
          </Box>
          {!isGuest && (
            <StudyNavigation
              studyVoteData={studyVoteData}
              locationEn={locationParam}
              date={date}
              myStudyInfo={getMyStudyInfo(mergeParticipation, session?.user.uid)}
              absences={mergeParticipation?.absences}
              placeInfo={{ name, address, latitude, longitude }}
              type={type}
              status={mergeParticipation?.status}
            />
          )}
          {isInviteModal && <StudyInviteModal setIsModal={setIsInviteModal} place={place} />}
        </>
      ) : (
        <MainLoading />
      )}
    </>
  );
}
