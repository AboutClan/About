import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

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

export default function Page() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { id, date } = useParams<{ id: string; date: string }>() || {};
  const privateParam = searchParams.get("private");

  const [study, setStudy] = useState<IParticipation>();
  const [realStudy, setRealStudy] = useState<RealTimeInfoProps[]>();
  const studyPairArr = useRecoilValue(studyPairArrState);
  const setMyStudy = useSetRecoilState(myStudyInfoState);
  const [studyDateStatus, setStudyDateStatus] = useRecoilState(studyDateStatusState);
  const findStudy = studyPairArr
    ?.find((study) => dayjsToStr(dayjs(study.date)) === date)
    .participations.find((par) => par.place._id === id);

  const isPrivateStudy = id === ALL_스터디인증;
  const { data: studyOne } = useStudyVoteOneQuery(date, id, {
    enabled: !findStudy && !!date && !!id && !privateParam,
  });

  const { data: studyVoteOne } = useStudyVoteQuery(date, "전체", false, false, {
    enabled: !!date && !!privateParam,
  });

  useEffect(() => {
    if (!session) return;
    if (privateParam) {
      if (privateParam === "off") {
        setStudy(studyVoteOne?.[0]?.participations?.find((par) => par.place._id === id));
      } else {
        const findRealStudy = studyVoteOne?.[0]?.realTime?.find((par) => par._id === id);
        setRealStudy(
          studyVoteOne?.[0]?.realTime?.filter((par) => par.place.text === findRealStudy.place.text),
        );
      }
      return;
    }
    const tempStudy = studyOne || findStudy;
    if (!tempStudy) return;
    setStudy(tempStudy);
    const isMyStudy =
      tempStudy.status !== "dismissed" &&
      tempStudy.attendences.find((who) => who.user.uid === session.user.uid);
    if (isMyStudy) setMyStudy(tempStudy);
  }, [studyPairArr, studyOne, session, studyVoteOne, privateParam]);

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
      {study ? (
        <>
          <StudyHeader
            brand={place.brand}
            fullname={place.fullname}
            locationDetail={place.location}
            coverImage={place.coverImage}
          />
          <Slide isNoPadding>
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
            <StudyParticipants participants={attendances} absences={study.absences} />
            <StudyNavigation voteCnt={attendances?.length} studyStatus={study.status} />
          </Slide>
        </>
      ) : realStudy ? (
        <>
          <StudyHeader
            brand={place.brand}
            fullname={place.fullname}
            locationDetail={place.location}
            coverImage={place.coverImage}
          />
          <Slide isNoPadding>
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
            <StudyParticipants participants={attendances} absences={study.absences} />
            <StudyNavigation voteCnt={attendances?.length} studyStatus={study.status} />
          </Slide>
        </>
      ) : null}
    </Layout>
  );
}

const Layout = styled.div`
  padding-bottom: 161px;
`;
