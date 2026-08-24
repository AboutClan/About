import { Box } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";

import SlideSectionCol from "../../components/molecules/SlideSectionCol";
import { useWindowWidth } from "../../hooks/custom/CustomHooks";
import { useGroupSnapshotQuery } from "../../hooks/groupStudy/queries";
import HomeGroupCol from "./HomeGroupCol";

function HomeHotClubSection() {
  const { data: groups } = useGroupSnapshotQuery();

  const windowWidth = useWindowWidth(); // 현재 화면 너비 가져오기
  const width = windowWidth - 70;
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
      <AnimatePresence initial={false}>
        <motion.div
          drag="x"
          dragConstraints={{ left: -width, right: 0 }}
          dragElastic={0.3}
          style={{
            marginLeft: "20px",
            display: "flex",
            width: "100%",
            gap: "16px",
          }}
        >
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
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}

export default HomeHotClubSection;
