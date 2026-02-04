import dayjs from "dayjs";
import { useEffect } from "react";

import { dayjsToStr } from "../../utils/dateTimeUtils";

export default function ShareParticipations() {
  useEffect(() => {
    const openUrl =
      "https://about20s.club/_open" + `?dl=studyPage?date=${dayjsToStr(dayjs())}&result=on`;

    window.location.replace(openUrl);
  }, []);

  return <></>;
}
