import dayjs from "dayjs";
import { useEffect } from "react";

import { dayjsToStr } from "../../utils/dateTimeUtils";

export default function ApplyStudy() {
  useEffect(() => {
    const openUrl =
      "https://about20s.club/_open" +
      `?dl=study/participations/${dayjsToStr(
        dayjs(),
      )}?type=participations&modal=applyChange&location=true`;

    window.location.replace(openUrl);
  }, []);

  return <></>;
}
