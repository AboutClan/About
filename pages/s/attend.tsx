import dayjs from "dayjs";
import { useEffect } from "react";

import { dayjsToStr } from "../../utils/dateTimeUtils";

export default function ShareParticipations() {
  useEffect(() => {
    const openUrl =
      "https://about20s.club/_open" +
      `?dl=study/realTime/${dayjsToStr(dayjs())}?type=soloRealTimes`;

    window.location.replace(openUrl);
  }, []);

  return <></>;
}
