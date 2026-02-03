import dayjs from "dayjs";
import { useEffect } from "react";

import { useStudySetQuery } from "../../hooks/study/queries";
import { dayjsToStr, getTodayStr } from "../../utils/dateTimeUtils";

export default function ShareParticipationsStudyResult() {
  const { data: studySet } = useStudySetQuery(getTodayStr());
  console.log(studySet);
  useEffect(() => {
    const openUrl =
      "https://about20s.club/_open" +
      `?dl=study/participations/${dayjsToStr(dayjs())}?type=participations`;

    window.location.replace(openUrl);
  }, []);

  return <></>;
}
