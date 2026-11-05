import dayjs from "dayjs";
import { useMemo } from "react";

import { useGatherReviewListQuery } from "@/features/gather/hooks/queries";
import { useStudyMineQuery } from "@/features/study/hooks/queries";
import { useUserInfo } from "@/hooks/custom/UserHooks";

export interface ReviewableItem {
  type: "gather" | "study";
  key: string;
  title: string;
  date: string;
  url: string;
}

/** 아직 멤버 평가를 남기지 않은 번개·스터디. 번개 기준(최근 2주)에 맞춰 스터디도 2주 안만 모은다 */
export function useReviewableItems(enabled = true) {
  const userInfo = useUserInfo();
  const { data: gathers, isLoading: isGatherLoading } = useGatherReviewListQuery({ enabled });
  const { data: studies, isLoading: isStudyLoading } = useStudyMineQuery({ enabled });

  const items = useMemo<ReviewableItem[]>(() => {
    const myId = userInfo?._id;
    if (!myId) return [];

    const gatherItems: ReviewableItem[] = (gathers ?? []).map((g) => ({
      type: "gather",
      key: `gather-${g.id}`,
      title: g.title,
      date: g.date,
      url: `/home/gatherReview?id=${g.id}`,
    }));

    const today = dayjs().startOf("day");
    const studyItems: ReviewableItem[] = (studies ?? []).flatMap((study) => {
      const date = dayjs(study.date);
      if (!date.isBefore(today) || date.isBefore(today.subtract(2, "week"))) return [];
      const result = study.results.find((r) =>
        r.members.some((m) => m.userId?._id === myId && m.arrived),
      );
      if (!result?.placeId || result.reviewers?.includes(myId)) return [];
      if (result.members.filter((m) => m.userId?._id !== myId).length === 0) return [];
      return [
        {
          type: "study" as const,
          key: `study-${study.date}-${result.placeId._id}`,
          title: result.placeId.location?.name ?? "스터디",
          date: study.date,
          url: `/home/studyReview?date=${study.date}&id=${result.placeId._id}`,
        },
      ];
    });

    return [...gatherItems, ...studyItems].sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));
  }, [gathers, studies, userInfo?._id]);

  return { items, isLoading: isGatherLoading || isStudyLoading };
}
