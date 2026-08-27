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

    return shuffled.slice(0, 6);
  }, [groups?.hotClub]);
  return (
    <Box>
      <SlideSectionRow gap="16px">
        <SlideSectionCol
          title="🔥26년 2학기, 동아리가 고민된다면?"
          subTitle="취향에 맞는 활동만 골라 시작하는 다양한 소모임"
        >
          <HomeGroupCol threeGroups={randomHotClubs.slice(0, 3)} type="expected" />
        </SlideSectionCol>
        <SlideSectionCol
          title="🔥26년 2학기, 동아리가 고민된다면?"
          subTitle="취향에 맞는 활동만 골라 시작하는 다양한 소모임"
        >
          <HomeGroupCol threeGroups={randomHotClubs.slice(3, 6)} type="expected" />
        </SlideSectionCol>
      </SlideSectionRow>
    </Box>
  );
}

export default HomeHotClubSection;
