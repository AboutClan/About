import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

import { MainLoading } from "../../../../components/atoms/loaders/MainLoading";
import Slide from "../../../../components/layouts/PageSlide";
import { useUserCurrentLocation } from "../../../../hooks/custom/CurrentLocationHook";
import { useStudyVoteQuery } from "../../../../hooks/study/queries";
import { convertMergePlaceToPlace } from "../../../../libs/study/convertMergePlaceToPlace";
import { findStudyById } from "../../../../libs/study/convertStudyToMergeStudy";
import StudyInviteModal from "../../../../modals/study/StudyInviteModal";
import StudyAddressMap from "../../../../pageTemplates/study/StudyAddressMap";
import StudyCover from "../../../../pageTemplates/study/StudyCover";
import StudyDateBar from "../../../../pageTemplates/study/StudyDateBar";
import StudyHeader from "../../../../pageTemplates/study/StudyHeader";
import StudyMembers from "../../../../pageTemplates/study/StudyMembers";
import StudyOverview from "../../../../pageTemplates/study/StudyOverView";
import StudyTimeBoard from "../../../../pageTemplates/study/StudyTimeBoard";
import { getDistanceFromLatLonInKm } from "../../../../utils/mathUtils";

export default function Page() {
  const { data: session } = useSession();
  const isGuest = session?.user.role === "guest";
  const searchParams = useSearchParams();
  const { id, date } = useParams<{ id: string; date: string }>() || {};
  const { currentLocation } = useUserCurrentLocation();

  const [isInviteModal, setIsInviteModal] = useState(false);

  const { data: studyVoteData, isLoading } = useStudyVoteQuery("2024-12-29", {
    enabled: !!date,
  });

  const findStudy = studyVoteData && findStudyById(studyVoteData, id);

  const placeInfo = convertMergePlaceToPlace(findStudy?.place);

  const distance =
    currentLocation &&
    getDistanceFromLatLonInKm(
      currentLocation.lat,
      currentLocation.lon,
      placeInfo.latitude,
      placeInfo.longitude,
    );
  const members = findStudy?.members;

  // const absences = studyVoteData?.participations.find((par) => par.place._id === id)?.absences;

  return (
    <>
      {findStudy ? (
        <>
          <StudyHeader date={date} placeInfo={placeInfo} />
          <Box mb={5}>
            <Slide isNoPadding>
              <StudyCover coverImage={placeInfo.coverImage} />
              <StudyOverview
                place={{ ...placeInfo }}
                distance={distance}
                status={"open"}
                time={placeInfo.time}
              />
            </Slide>
            <Box h={2} bg="gray.100" />
            <Slide>
              <StudyAddressMap
                name={placeInfo.name}
                address={placeInfo.address}
                latitude={placeInfo.latitude}
                longitude={placeInfo.longitude}
              />

              <StudyDateBar date={date} memberCnt={members.length} />
              <StudyTimeBoard members={members} />
              <Box h="1px" bg="gray.100" my={4} />
              <StudyMembers date={date} members={members} absences={null} />
            </Slide>
          </Box>
          {/* {!isGuest && (
            <StudyNavigation
              studyVoteData={studyVoteData}
              date={date}
              myStudyInfo={getMyStudyInfo(mergeParticipation, session?.user.uid)}
              absences={mergeParticipation?.absences}
              placeInfo={placeInfo}
              type={type}
              status={mergeParticipation?.status}
            />
          )} */}
          {isInviteModal && <StudyInviteModal setIsModal={setIsInviteModal} place={place} />}
        </>
      ) : (
        <MainLoading />
      )}
    </>
  );
}
