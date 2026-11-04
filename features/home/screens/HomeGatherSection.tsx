import { Box } from "@chakra-ui/react";

import SectionHeader from "@/components/atoms/SectionHeader";
import { HomeGatherSectionKey, useHomeGatherSectionsQuery } from "@/features/gather/hooks/queries";
import HomeGatherCol from "@/features/home/screens/HomeGatherCol";

const SECTION_SHOW_CNT = 3;

const SECTION_TEXT: Record<
  HomeGatherSectionKey,
  { title: string; subTitle: string; moreUrl: string | null }
> = {
  regular: {
    title: "🔥 매주 진행되는 어바웃 공식 모임",
    subTitle: "취향 맞는 친구들과 만나는 가장 쉬운 방법",
    moreUrl: "/gather",
  },
  upcoming: {
    title: "⚡ 이번 주 번개 모임",
    subTitle: "내가 원하는 때, 내 취향대로, 골라서 참여!",
    moreUrl: "/gather",
  },
  past: {
    title: "👀 지난 인기 모임",
    subTitle: "이런 모임들이 열렸어요",
    moreUrl: "/gather",
  },
  partner: {
    title: "🤝 외부 파트너 모임",
    subTitle: "어바웃 회원이라면 할인받고 참여할 수 있어요",
    moreUrl: null,
  },
};

interface HomeGatherSectionProps {
  type: HomeGatherSectionKey;
}

/**
 * 홈 번개 섹션(카드 3개씩). 어떤 모임을 어떤 순서로 넣을지는 서버(findHomeGatherSectionsV2)가 정한다.
 * 모임이 하나도 없으면 섹션을 숨긴다(로딩 중에는 스켈레톤).
 */
function HomeGatherSection({ type }: HomeGatherSectionProps) {
  const { data } = useHomeGatherSectionsQuery();
  const gathers = data?.[type];
  const { title, subTitle, moreUrl } = SECTION_TEXT[type];

  if (data && !gathers?.length) return null;

  return (
    <Box px={5} mt={5}>
      <SectionHeader title={title} subTitle={subTitle} />
      <HomeGatherCol
        gathers={gathers?.slice(0, SECTION_SHOW_CNT)}
        isPriority={type === "regular"}
        maxCnt={gathers ? Math.min(gathers.length, SECTION_SHOW_CNT) : SECTION_SHOW_CNT}
        moreUrl={moreUrl}
      />
    </Box>
  );
}

export default HomeGatherSection;
