import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { STUDY_COVER_IMAGES } from "../../../../assets/images/studyCover";

import Divider from "../../../../components/atoms/Divider";
import Slide from "../../../../components/layouts/PageSlide";
import { ALL_스터디인증 } from "../../../../constants/serviceConstants/studyConstants/studyPlaceConstants";
import { useStudyVoteOneQuery, useStudyVoteQuery } from "../../../../hooks/study/queries";
import { getStudyDateStatus } from "../../../../libs/study/date/getStudyDateStatus";
import StudyCover from "../../../../pageTemplates/study/StudyCover";
import StudyDateBar from "../../../../pageTemplates/study/StudyDateBar";
import StudyHeader from "../../../../pageTemplates/study/StudyHeader";
import StudyNavigation from "../../../../pageTemplates/study/StudyNavigation";
import StudyOverview from "../../../../pageTemplates/study/StudyOverView";
import StudyParticipants from "../../../../pageTemplates/study/StudyParticipants";
import StudyTimeBoard from "../../../../pageTemplates/study/StudyTimeBoard";
import {
  myStudyInfoState,
  studyDateStatusState,
  studyPairArrState,
} from "../../../../recoils/studyRecoils";
import {
  IParticipation,
  RealTimeInfoProps,
} from "../../../../types/models/studyTypes/studyDetails";
import { dayjsToStr } from "../../../../utils/dateTimeUtils";
import { getRandomIdx } from "../../../../utils/mathUtils";

export default function Page() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { id, date } = useParams<{ id: string; date: string }>() || {};
  const privateParam = searchParams.get("private");

  const [study, setStudy] = useState<IParticipation>();
  const [realStudy, setRealStudy] = useState<RealTimeInfoProps[]>();
  const studyPairArr = useRecoilValue(studyPairArrState);
  const [myStudy, setMyStudy] = useRecoilState(myStudyInfoState);
  const [studyDateStatus, setStudyDateStatus] = useRecoilState(studyDateStatusState);
  const findStudy = studyPairArr
    ?.find((study) => dayjsToStr(dayjs(study.date)) === date)
    ?.participations?.find((par) => par.place._id === id);

  const isPrivateStudy = id === ALL_스터디인증;
  const { data: studyOne } = useStudyVoteOneQuery(date, id, {
    enabled: !findStudy && !!date && !!id && !privateParam,
  });

  const { data: studyVoteOne } = useStudyVoteQuery(date, "전체", false, false, {
    enabled: !!date && !!privateParam,
  });
  const findRealStudy = studyVoteOne?.[0]?.realTime?.find((par) => par._id === id);

  useEffect(() => {
    if (!session) return;
    if (privateParam) {
      if (privateParam === "off") {
        const findStudy = studyVoteOne?.[0]?.participations?.find((par) => par.place._id === id);
        setStudy(findStudy);
        setMyStudy(findStudy);
      } else {
        setRealStudy(
          studyVoteOne?.[0]?.realTime?.filter((par) => par.place.text === findRealStudy.place.text),
        );
      }
    }

    const tempStudy = studyOne || findStudy;

    if (!tempStudy) return;
    setStudy(tempStudy);
    const isMyStudy = tempStudy.attendences.find((who) => who.user.uid === session.user.uid);
    if (isMyStudy) setMyStudy(tempStudy);
  }, [studyPairArr, studyOne, session, studyVoteOne, privateParam]);

  useEffect(() => {
    setStudyDateStatus(getStudyDateStatus(date));
  }, [date]);
  console.log(123, myStudy);
  const place =
    study?.place ||
    (findRealStudy && {
      fullname: findRealStudy.place.text,
      latitude: findRealStudy.place.lat,
      longitude: findRealStudy.place.lon,
      coverImage: STUDY_COVER_IMAGES[getRandomIdx(STUDY_COVER_IMAGES.length - 1)],
      brand: findRealStudy.place.text.split(" ")?.[0],
      locationDetail: findRealStudy.place.locationDetail,
      time: null,
    });
  const realPlace = findRealStudy?.place;

  const attendances =
    studyDateStatus !== "not passed"
      ? study?.attendences.filter((att) => att.firstChoice)
      : study?.attendences;

  return (
    <Layout>
      {study ? (
        <>
          <StudyHeader
            fullname={place.fullname}
            locationDetail={place.locationDetail}
            coverImage={place.coverImage}
          />
          <Slide isNoPadding>
            <StudyCover
              isPrivateStudy={isPrivateStudy}
              imageUrl={place.coverImage}
              brand={place.brand}
            />
            <StudyOverview
              title={place.fullname}
              locationDetail={place.locationDetail}
              time={place.time}
              participantsNum={attendances.length}
              coordinate={{
                lat: place.latitude,
                lng: place.longitude,
              }}
            />
            <Divider />
            <StudyDateBar place={place} />
            <StudyTimeBoard participants={attendances} studyStatus={study.status} />
            <StudyParticipants participants={attendances} absences={study.absences} />
            <StudyNavigation voteCnt={attendances?.length} studyStatus={study.status} />
          </Slide>
        </>
      ) : realStudy ? (
        <>
          <StudyHeader
            fullname={place.fullname}
            locationDetail={place.locationDetail}
            coverImage={place.coverImage}
          />
          <Slide isNoPadding>
            <StudyCover
              isPrivateStudy={isPrivateStudy}
              imageUrl={place.coverImage}
              brand={place.brand}
            />

            <StudyOverview
              title={place.fullname}
              locationDetail={place.locationDetail}
              time={place.time}
              participantsNum={realStudy.length}
              coordinate={{
                lat: place.latitude,
                lng: place.longitude,
              }}
            />
            <Divider />
            <StudyDateBar place={place} />

            <StudyTimeBoard participants={realStudy} studyStatus={findRealStudy.status} />

            <StudyParticipants participants={realStudy} absences={null} />
            <StudyNavigation voteCnt={realStudy?.length} studyStatus={findRealStudy.status} />
          </Slide>
        </>
      ) : null}
    </Layout>
  );
}

const Layout = styled.div`
  padding-bottom: 161px;
`;
