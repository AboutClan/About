import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { STUDY_CREW_REGION_SLUG_MAPPING } from "@/constants/service/study/place";
import { dayjsToStr } from "@/utils/dateTimeUtils";

export default function StudyCrewApply() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const crew = router.query.crew as string;

    // 지역 슬러그는 없어도 되고, 알 수 없는 값이면 없는 것으로 본다.
    // 예전에는 여기서 멈춰 빈 화면이 남았다 — 지역을 못 붙인 링크로 들어온
    // 사람도 신청 화면까지는 가야 한다. 상세 페이지의 location은
    // crew가 없으면 스터디 장소로 대체되므로(study/[id]/[date] 576행) 그대로 열린다.
    const crewParam = crew && crew in STUDY_CREW_REGION_SLUG_MAPPING ? `&crew=${crew}` : "";

    const openUrl =
      "https://about20s.club/_open" +
      `?dl=study/participations/${dayjsToStr(
        dayjs(),
      )}?type=participations&studyLocation=true&modal=applyChange&location=true${crewParam}`;

    window.location.replace(openUrl);
  }, [router.isReady, router.query.crew]);

  return <></>;
}
