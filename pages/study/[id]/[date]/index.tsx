import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Slide from "../../../../components/layouts/PageSlide";
import { useCurrentLocation } from "../../../../hooks/custom/CurrentLocationHook";
import { useStudyVoteQuery } from "../../../../hooks/study/queries";
import { convertMergePlaceToPlace } from "../../../../libs/study/convertMergePlaceToPlace";
import {
  convertStudyToParticipations,
  getMyStudyInfo,
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
import { StudyParticipationProps } from "../../../../types/models/studyTypes/studyDetails";
import { LocationEn } from "../../../../types/services/locationTypes";
import { convertLocationLangTo } from "../../../../utils/convertUtils/convertDatas";
import { getDistanceFromLatLonInKm } from "../../../../utils/mathUtils";

export default function Page() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { id, date } = useParams<{ id: string; date: string }>() || {};
  const { currentLocation } = useCurrentLocation();

  const locationParam = searchParams.get("location") as LocationEn;

  const [studyParticipation, setStudyParticipation] = useState<StudyParticipationProps>();
  const [isInviteModal, setIsInviteModal] = useState(false);

  // const [myStudy, setMyStudy] = useRecoilState(myStudyInfoState);
  // const [studyDateStatus, setStudyDateStatus] = useRecoilState(studyDateStatusState);
  // const findStudy = studyPairArr
  //   ?.find((study) => dayjsToStr(dayjs(study.date)) === date)
  //   ?.participations?.find((par) => par.place._id === id);

  // const isPrivateStudy = id === ALL_스터디인증;

  const { data: studyVoteData } = useStudyVoteQuery(
    date,
    convertLocationLangTo(locationParam, "kr"),
    {
      enabled: !!date && !!locationParam,
    },
  );
  

  useEffect(() => {
    if (!session) return;
    // if (privateParam) {
    //   if (privateParam === "off") {
    //     const findStudy = studyVoteOne?.[0]?.participations?.find((par) => par.place._id === id);
    //     setStudy(findStudy);
    //     setMyStudy(findStudy);
    //   } else {
    //     setRealStudy(
    //       studyVoteOne?.[0]?.realTime?.filter((par) => par.place.text === findRealStudy.place.text),
    //     );
    //   }
    // }

    // const tempStudy = studyOne || findStudy;

    // if (!tempStudy) return;
    // setStudy(tempStudy);
    // const isMyStudy = tempStudy.members.find((who) => who.user.uid === session.user.uid);
    // if (isMyStudy) setMyStudy(tempStudy);
  }, [session]);

  // useEffect(() => {
  //   setStudyDateStatus(getStudyDateStatus(date));
  // }, [date]);

  // const place =
  //   study?.place ||
  //   (findRealStudy && {
  //     fullname: findRealStudy.place.text,
  //     latitude: findRealStudy.place.lat,
  //     longitude: findRealStudy.place.lon,
  //     coverImage: STUDY_COVER_IMAGES[getRandomIdx(STUDY_COVER_IMAGES.length - 1)],
  //     brand: findRealStudy.place.text.split(" ")?.[0],
  //     locationDetail: findRealStudy.place.locationDetail,
  //     time: null,
  //   });
  // const realPlace = findRealStudy?.place;

  // const members =
  //   studyDateStatus !== "not passed"
  //     ? study?.members.filter((att) => att.firstChoice)
  //     : study?.members;

  const mergeParticipations = convertStudyToParticipations(
    studyVoteData,
    convertLocationLangTo(locationParam, "kr"),
  );
  const mergeParticipation = mergeParticipations?.find(
    (participation) => participation.place._id === id,
  );

  const place = convertMergePlaceToPlace(mergeParticipation?.place);
  const { name, address, coverImage, latitude, longitude, time } = place || {};

  const distance =
    currentLocation &&
    getDistanceFromLatLonInKm(currentLocation.lat, currentLocation.lon, latitude, longitude);
  const members = mergeParticipation?.members;

  return (
    <>
      {mergeParticipation && (
        <>
          <StudyHeader name={name} address={address} coverImage={coverImage} />
          <Box mb={3}>
            <Slide>
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

              <StudyDateBar
                date={date}
                memberCnt={members.length}
                setIsInviteModal={setIsInviteModal}
              />
              <StudyTimeBoard members={members} studyStatus={mergeParticipation.status} />
              <Box h="1px" bg="gray.100" my={4} />
              <StudyMembers members={members} setIsInviteModal={setIsInviteModal} />
            </Slide>
          </Box>
          <StudyNavigation
            mergeParticipations={mergeParticipations}
            memberCnt={members?.length}
            myStudyInfo={getMyStudyInfo(mergeParticipation, session?.user.uid)}
            absences={mergeParticipation?.absences}
          />
          {isInviteModal && <StudyInviteModal setIsModal={setIsInviteModal} place={place} />}
        </>
      )}
    </>
  );
}
