import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { useStudySetQuery } from "../../hooks/study/queries";
import { StudyConfirmedMemberProps } from "../../types/models/studyTypes/study-entity.types";
import { dayjsToStr, getTodayStr } from "../../utils/dateTimeUtils";

export default function ShareParticipationsStudyResult() {
  const { data: session } = useSession();
  const { data: studySet } = useStudySetQuery(getTodayStr());
  console.log(studySet);

  useEffect(() => {
    if (!studySet || !session) return;
    let myStudy: StudyConfirmedMemberProps;
    let id;
    let type;
    console.log(id, type);
    studySet.results.forEach((result) => {
      if (result.date === getTodayStr()) {
        const study = result.study;
        myStudy = study.members.find((member) => member.user.uid === session?.user.uid);
        if (myStudy) {
          id = study.place._id;
        }
      }
    });
  }, [studySet, session]);

  useEffect(() => {
    const openUrl =
      "https://about20s.club/_open" +
      `?dl=study/participations/${dayjsToStr(dayjs())}?type=participations`;

    window.location.replace(openUrl);
  }, []);

  return <></>;
}
