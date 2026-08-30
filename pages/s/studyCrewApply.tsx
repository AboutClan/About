import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { STUDY_CREW_REGION_SLUG_MAPPING } from "../../constants/service/study/place";
import { dayjsToStr } from "../../utils/dateTimeUtils";

export default function StudyCrewApply() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const crew = router.query.crew as string;
    if (!crew || !(crew in STUDY_CREW_REGION_SLUG_MAPPING)) return;

    const openUrl =
      "https://about20s.club/_open" +
      `?dl=study/participations/${dayjsToStr(
        dayjs(),
      )}?type=participations&studyLocation=true&modal=applyChange&location=true&crew=${crew}`;

    window.location.replace(openUrl);
  }, [router.isReady, router.query.crew]);

  return <></>;
}
