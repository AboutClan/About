import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import Divider from "../../../../components/atoms/Divider";
import Slide from "../../../../components/layouts/PageSlide";
import { PLACE_TO_LOCATION } from "../../../../constants/serviceConstants/studyConstants/studyLocationConstants";
import { useStudyVoteQuery } from "../../../../hooks/study/queries";
import { getStudyDateStatus } from "../../../../libs/study/date/getStudyDateStatus";
import { getMyStudy } from "../../../../libs/study/getMyStudy";
import StudyCover from "../../../../pageTemplates/study/StudyCover";
import StudyDateBar from "../../../../pageTemplates/study/StudyDateBar";
import StudyHeader from "../../../../pageTemplates/study/StudyHeader";
import StudyNavigation from "../../../../pageTemplates/study/StudyNavigation";
import StudyOverview from "../../../../pageTemplates/study/StudyOverView";
import StudyParticipants from "../../../../pageTemplates/study/StudyParticipants";
import StudyTimeBoard from "../../../../pageTemplates/study/StudyTimeBoard";
import {
  myStudyState,
  studyDateStatusState,
} from "../../../../recoils/studyRecoils";

export default function Page() {
  const { data } = useSession();
  const { id, date } = useParams<{ id: string; date: string }>() || {};

  const setMyStudy = useSetRecoilState(myStudyState);

  const location = PLACE_TO_LOCATION[id];

  const { data: studyAll } = useStudyVoteQuery(date, location, {
    enabled: !!location && !!date,
  });

  const [studyDateStatus, setStudyDateStatus] =
    useRecoilState(studyDateStatusState);

  useEffect(() => {
    setStudyDateStatus(getStudyDateStatus(date));
  }, [date]);

  useEffect(() => {
    if (!studyAll || !data?.user) return;
    setMyStudy(getMyStudy(studyAll, data.user.uid));
  }, [studyAll]);

  const study = studyAll?.find((study) => study.place._id === id);

  const place = study?.place;

  const attendances =
    studyDateStatus !== "not passed"
      ? study?.attendences.filter((att) => att.firstChoice)
      : study?.attendences;
  const isPrivateStudy = place?.brand === "자유 신청";

  return (
    <Layout>
      {study && (
        <>
          <StudyHeader place={place} />
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
            <StudyDateBar isPrivateStudy={isPrivateStudy} />
            {!isPrivateStudy && (
              <StudyTimeBoard
                participants={attendances}
                studyStatus={study.status}
              />
            )}
            <StudyParticipants
              participants={attendances}
              absences={study.absences}
            />
          </Slide>
          <StudyNavigation
            voteCnt={attendances?.length}
            studyStatus={study.status}
          />
        </>
      )}
    </Layout>
  );
}

const Layout = styled.div`
  padding-bottom: 161px;
`;
