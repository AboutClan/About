import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { useToast } from "../../hooks/custom/CustomToast";
import { useStudySetQuery } from "../../hooks/study/queries";
import { StudyConfirmedMemberProps } from "../../types/models/studyTypes/study-entity.types";
import { dayjsToStr, getTodayStr } from "../../utils/dateTimeUtils";

export default function ShareParticipationsStudyResult() {
  const toast = useToast();
  const { data: session } = useSession();
  const { data: studySet } = useStudySetQuery(getTodayStr());

  useEffect(() => {
    if (!studySet || !session) return;
    let myStudy: StudyConfirmedMemberProps;
    let id;

    studySet.results.forEach((result) => {
      if (result.date === getTodayStr()) {
        const study = result.study;
        myStudy = study.members.find((member) => member.user.uid === session?.user.uid);
        if (myStudy) {
          id = study.place._id;

          const openUrl =
            "https://about20s.club/_open" + `?dl=study/${id}/${getTodayStr()}?type=results`;
          window.location.replace(openUrl);
        }
        return;
      }
    });
    studySet.openRealTimes.forEach((realTimes) => {
      if (realTimes.date === getTodayStr()) {
        const study = realTimes.study;
        myStudy = study.members.find((member) => member.user.uid === session?.user.uid);
        if (myStudy) {
          id = study.place._id;
          const openUrl =
            "https://about20s.club/_open" + `?dl=study/${id}/${getTodayStr()}?type=openRealTimes`;
          window.location.replace(openUrl);
        }
        return;
      }
    });

    toast("info", "오늘 참석중인 스터디가 없습니다.");
    const openUrl =
      "https://about20s.club/_open" +
      `?dl=study/participations/${dayjsToStr(dayjs())}?type=participations`;

    window.location.replace(openUrl);
  }, [studySet, session]);

  return <></>;
}
