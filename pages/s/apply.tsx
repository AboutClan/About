import dayjs from "dayjs";
import { useEffect } from "react";

import { dayjsToStr } from "../../utils/dateTimeUtils";

export default function ApplyStudy() {
  useEffect(() => {
    const path = `study/participations/${dayjsToStr(dayjs())}`;
    const openUrl =
      `https://about20s.club/_open?dl=${encodeURIComponent(path)}` +
      `&type=participations&modal=applyChange&location=true`;

    window.location.replace(openUrl);
  }, []);

  return <></>;
}
