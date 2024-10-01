import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

import Divider from "../../../../components/atoms/Divider";
import Slide from "../../../../components/layouts/PageSlide";
import { ALL_스터디인증 } from "../../../../constants/serviceConstants/studyConstants/studyPlaceConstants";
import { useStudyVoteOneQuery } from "../../../../hooks/study/queries";
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
import { IParticipation } from "../../../../types/models/studyTypes/studyDetails";
import { dayjsToStr } from "../../../../utils/dateTimeUtils";

export default function Page() {
  const { data: session } = useSession();
  const { id, date } = useParams<{ id: string; date: string }>() || {};

  const [study, setStudy] = useState<IParticipation>();
  const studyPairArr = useRecoilValue(studyPairArrState);
  const setMyStudy = useSetRecoilState(myStudyInfoState);
  const [studyDateStatus, setStudyDateStatus] = useRecoilState(studyDateStatusState);
  const findStudy = studyPairArr
    ?.find((study) => dayjsToStr(dayjs(study.date)) === date)
    .participations.find((par) => par.place._id === id);

  const isPrivateStudy = id === ALL_스터디인증;
  const { data: studyOne } = useStudyVoteOneQuery(date, id, {
    enabled: !findStudy && !!date && !!id,
  });

  useEffect(() => {
    if (!session) return;
    const tempStudy = studyOne || findStudy;
    if (!tempStudy) return;
    setStudy(tempStudy);
    const isMyStudy =
      tempStudy.status !== "dismissed" &&
      tempStudy.attendences.find((who) => who.user.uid === session.user.uid);
    if (isMyStudy) setMyStudy(tempStudy);
  }, [studyPairArr, studyOne, session]);

  useEffect(() => {
    setStudyDateStatus(getStudyDateStatus(date));
  }, [date]);

  const place = study?.place;

  const attendances =
    studyDateStatus !== "not passed"
      ? study?.attendences.filter((att) => att.firstChoice)
      : study?.attendences;

  return (
    <Layout>
      {study && (
        <>
          <StudyHeader
            brand={place.brand}
            fullname={place.fullname}
            locationDetail={place.location}
            coverImage={place.coverImage}
          />
          <Slide>
            <StudyCover
              isPrivateStudy={isPrivateStudy}
              imageUrl={place.coverImage}
              brand={place.brand}
            />
            {!isPrivateStudy && (
              <>
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
              </>
            )}
            <StudyDateBar isPrivateStudy={isPrivateStudy} place={place} />
            {!isPrivateStudy && (
              <StudyTimeBoard participants={attendances} studyStatus={study.status} />
            )}
          </Slide>
          <StudyParticipants participants={attendances} absences={study.absences} />
          <StudyNavigation voteCnt={attendances?.length} studyStatus={study.status} />
        </>
      )}
    </Layout>
  );
}

const Layout = styled.div`
  padding-bottom: 161px;
`;
