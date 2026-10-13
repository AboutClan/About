import dayjs from "dayjs";

import SlideSectionCol from "@/components/molecules/SlideSectionCol";
import SlideSectionRow from "@/components/molecules/SlideSectionRow";
import { useGatherQuery } from "@/features/gather/hooks/queries";
import HomeGatherCol from "@/features/home/screens/HomeGatherCol";
import { IGather } from "@/types/models/gatherTypes/gatherTypes";

// 공식 행사로 노출할 모임 id를 원하는 순서대로 나열하면 그 순서대로 2x3 배치됩니다.
// 비워두면 첫번째 섹션 후보(officialGather/openGather/secretGather) 중 기본 순서로 6개를 사용합니다.
const FEATURED_GATHER_ID_ORDER: number[] = [];

const FEATURED_CATEGORIES = ["officialGather", "openGather", "secretGather", "gather2"];

interface HomeGatherSectionProps {
  type: "official" | "general";
}

function HomeGatherSection({ type }: HomeGatherSectionProps) {
  const { data: gathers } = useGatherQuery(-1);
  // 공식 행사 섹션에는 officialGather/openGather/secretGather/gather2만 노출된다.
  // 다가오는 모임은 가까운 날짜순, 이미 지난 모임은 그 뒤에 최근 것부터. 날짜 미정은 맨 뒤.
  const now = dayjs();
  const getSortKey = (gather: IGather) => {
    const date = dayjs(gather.date);
    if (!date.isValid()) return [2, 0];
    return date.isBefore(now) ? [1, -date.valueOf()] : [0, date.valueOf()];
  };
  const featuredPool = gathers
    ?.filter((gather) => gather && FEATURED_CATEGORIES.includes(gather.category))
    .sort((a, b) => {
      const [groupA, valueA] = getSortKey(a);
      const [groupB, valueB] = getSortKey(b);
      return groupA - groupB || valueA - valueB;
    });

  const featuredData = FEATURED_GATHER_ID_ORDER.length
    ? FEATURED_GATHER_ID_ORDER.map((id) =>
        featuredPool?.find((gather) => gather?.id === id),
      ).filter((gather) => !!gather)
    : featuredPool?.slice(0, 6);

  // 일반 번개 섹션에서는 공식 행사 섹션에 이미 노출된 모임을 제외하고 채운다.
  const usedIds = new Set(featuredData?.map((gather) => gather?.id));

  const upcomingData = gathers?.slice(6, 12)?.filter((gather) => gather && !usedIds.has(gather.id));

  const isOfficial = type === "official";
  const data = isOfficial ? featuredData : upcomingData;
  const title = isOfficial ? "🔥 놓치면 후회하는 About 공식 행사" : "오늘 뭐하지? About 번개";
  const subTitle = isOfficial
    ? "어바웃 동아리의 공식 모임, 지금 바로 신청하세요!"
    : "내가 원하는 때, 내 취향대로, 골라서 참여!";

  return (
    <SlideSectionRow gap="12px">
      <SlideSectionCol title={title} subTitle={subTitle}>
        <HomeGatherCol
          gathers={data?.slice(0, 3)?.filter((gather) => !!gather)}
          isPriority={isOfficial}
        />
      </SlideSectionCol>
      <SlideSectionCol title={title} subTitle={subTitle}>
        <HomeGatherCol
          gathers={data?.slice(3, 6)?.filter((gather) => !!gather)}
          isPriority={isOfficial}
        />
      </SlideSectionCol>
    </SlideSectionRow>
  );
}

export default HomeGatherSection;
