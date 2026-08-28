import { Box } from "@chakra-ui/react";
import { useMemo } from "react";

import SlideSectionCol from "../../components/molecules/SlideSectionCol";
import SlideSectionRow from "../../components/molecules/SlideSectionRow";
import { useGroupSnapshotQuery } from "../../hooks/groupStudy/queries";
import HomeGroupCol from "./HomeGroupCol";

function HomeHotClubSection() {
  const { data: groups } = useGroupSnapshotQuery();

  const randomHotClubs = useMemo(() => {
    if (!groups?.hotClub) return [];

    const shuffled = [...groups.hotClub];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }

    return shuffled.slice(0, 12);
  }, [groups?.hotClub]);
  return (
    <Box>
      <SlideSectionRow gap="16px">
        <SlideSectionCol
          title="🔥26년 2학기, 동아리가 고민된다면?"
          subTitle="취향대로 선택해 참여하는 다양한 소모임"
        >
          <HomeGroupCol threeGroups={randomHotClubs.slice(0, 3)} type="expected" />
        </SlideSectionCol>
        <SlideSectionCol
          title="🔥26년 2학기, 동아리가 고민된다면?"
          subTitle="취향대로 선택해 참여하는 다양한 소모임"
        >
          <HomeGroupCol threeGroups={randomHotClubs.slice(3, 6)} type="expected" />
        </SlideSectionCol>
      </SlideSectionRow>
      <SlideSectionRow gap="16px">
        <SlideSectionCol
          title="2학기를 책임질 든든한 취미 소모임"
          subTitle="학교 끝나면 시작되는 은밀한(?) 취미 생활"
        >
          <HomeGroupCol threeGroups={randomHotClubs.slice(6, 9)} type="expected" />
        </SlideSectionCol>
        <SlideSectionCol
          title="2학기를 책임질 든든한 취미 소모임"
          subTitle="학교 끝나면 시작되는 은밀한(?) 취미 생활"
        >
          <HomeGroupCol threeGroups={randomHotClubs.slice(9, 12)} type="expected" />
        </SlideSectionCol>
      </SlideSectionRow>
    </Box>
  );
}

export default HomeHotClubSection;
