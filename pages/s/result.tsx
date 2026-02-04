import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { useToast } from "../../hooks/custom/CustomToast";
import { useStudySetQuery } from "../../hooks/study/queries";
import { dayjsToStr, getTodayStr } from "../../utils/dateTimeUtils";

export default function ShareParticipationsStudyResult() {
  const toast = useToast();
  const { data: session } = useSession();
  const { data: studySet } = useStudySetQuery(getTodayStr());

  useEffect(() => {
    if (!studySet || !session) return;

    const today = getTodayStr();
    const uid = session.user.uid;

    const fallbackUrl = `https://about20s.club/_open` + `?dl=studyPage?date=${dayjsToStr(dayjs())}`;

    // ✅ 무조건 fallback은 예약해 둔다 (보장)
    const fallbackTimer = window.setTimeout(() => {
      toast("info", "오늘 참석중인 스터디가 없습니다.");
      window.location.replace(fallbackUrl);
    }, 120);

    const go = (url: string) => {
      window.clearTimeout(fallbackTimer); // ✅ 성공하면 fallback 취소
      window.location.replace(url);
    };

    // 1) results 우선
    const r = studySet.results.find(
      (result) => result.date === today && result.study.members.some((m) => m.user.uid === uid),
    );

    if (r) {
      const id = r.study.place._id;
      go(`https://about20s.club/_open?dl=study/${id}/${today}?type=results`);
      return;
    }

    // 2) openRealTimes
    const o = studySet.openRealTimes.find(
      (rt) => rt.date === today && rt.study.members.some((m) => m.user.uid === uid),
    );

    if (o) {
      const id = o.study.place._id;
      go(`https://about20s.club/_open?dl=study/${id}/${today}?type=openRealTimes`);
      return;
    }

    // ✅ 여기서 아무것도 안 해도 됨: fallback 예약이 이미 있음
    return () => {
      window.clearTimeout(fallbackTimer);
    };
  }, [studySet, session]);

  return <></>;
}
