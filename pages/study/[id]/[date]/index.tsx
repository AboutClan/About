import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { STUDY_MAIN_IMAGES } from "../../../../assets/images/studyMain";

import Divider from "../../../../components/atoms/Divider";
import Slide from "../../../../components/layouts/PageSlide";
import { useStudyVoteOneQuery, useStudyVoteQuery } from "../../../../hooks/study/queries";
import { getStudyParticipationById } from "../../../../libs/study/getMyStudyMethods";
import StudyCover from "../../../../pageTemplates/study/StudyCover";
import StudyDateBar from "../../../../pageTemplates/study/StudyDateBar";
import StudyHeader from "../../../../pageTemplates/study/StudyHeader";
import StudyParticipants from "../../../../pageTemplates/study/StudyMembers";
import StudyNavigation from "../../../../pageTemplates/study/StudyNavigation";
import StudyOverview from "../../../../pageTemplates/study/StudyOverView";
import StudyTimeBoard from "../../../../pageTemplates/study/StudyTimeBoard";
import {
  StudyParticipationProps,
  StudyPlaceProps,
} from "../../../../types/models/studyTypes/studyDetails";
import { PlaceInfoProps } from "../../../../types/models/utilTypes";
import { LocationEn } from "../../../../types/services/locationTypes";
import { convertLocationLangTo } from "../../../../utils/convertUtils/convertDatas";
import { getRandomIdx } from "../../../../utils/mathUtils";

export default function Page() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { id, date } = useParams<{ id: string; date: string }>() || {};

  const locationParam = searchParams.get("location") as LocationEn;

  const [studyParticipation, setStudyParticipation] = useState<StudyParticipationProps>();

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

  const { data: studyOne } = useStudyVoteOneQuery(date, id, {
    enabled: !locationParam && !!date && !!id,
  });

  const participation = studyVoteData ? getStudyParticipationById(studyVoteData, id) : studyOne;

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
  }, [studyOne, session]);

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

  const place = participation?.place;
  const studyPlace = participation?.place as StudyPlaceProps;
  const realTimePlace = participation?.place as PlaceInfoProps;

  const members = participation?.members;
  
  return (
    <>
      {participation && (
        <>
          <StudyHeader
            fullname={studyPlace?.fullname || realTimePlace?.name}
            locationDetail={studyPlace?.locationDetail || realTimePlace?.address}
            coverImage={
              studyPlace?.coverImage || STUDY_MAIN_IMAGES[getRandomIdx(STUDY_MAIN_IMAGES.length)]
            }
          />
          <Slide isNoPadding>
            <StudyCover
              imageUrl={
                studyPlace?.coverImage || STUDY_MAIN_IMAGES[getRandomIdx(STUDY_MAIN_IMAGES.length)]
              }
              brand={studyPlace?.brand || realTimePlace?.name.split(" ")?.[0]}
            />
            <StudyOverview
              title={studyPlace?.fullname || realTimePlace?.name}
              locationDetail={studyPlace?.locationDetail || realTimePlace?.address}
              time={studyPlace?.time}
              participantsNum={members.length}
              coordinate={{
                lat: place.latitude,
                lng: place.longitude,
              }}
            />
            <Divider />
            <StudyDateBar place={place} />
            <StudyTimeBoard members={members} studyStatus={participation.status} />
            <StudyParticipants members={members} />
            <StudyNavigation voteCnt={members?.length} studyStatus={participation.status} />
          </Slide>
        </>
      )}
    </>
  );
}
