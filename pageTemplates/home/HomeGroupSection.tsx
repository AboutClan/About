import { Box } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";

import SlideSectionCol from "../../components/molecules/SlideSectionCol";
import { useWindowWidth } from "../../hooks/custom/CustomHooks";
import { useGroupSnapshotQuery } from "../../hooks/groupStudy/queries";
import HomeGroupCol from "./HomeGroupCol";

function HomeGroupSection() {
  const { data: groups } = useGroupSnapshotQuery();

  const windowWidth = useWindowWidth(); // 현재 화면 너비 가져오기
  const width = windowWidth - 70;

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
          <SlideSectionCol title="About 취미 소모임" subTitle="같은 취미로 이어지는 우리">
            <HomeGroupCol threeGroups={groups?.hobby.slice(0, 3)} type="hobby" />
          </SlideSectionCol>
          <SlideSectionCol title="About 취미 소모임" subTitle="같은 취미로 이어지는 우리">
            <HomeGroupCol threeGroups={groups?.hobby.slice(3, 6)} type="hobby" />
          </SlideSectionCol>
        </motion.div>
      </AnimatePresence>
      <AnimatePresence initial={false}>
        <motion.div
          drag="x"
          dragConstraints={{ left: -width, right: 0 }}
          dragElastic={0.3}
          style={{
            marginLeft: "20px",
            display: "flex",
            width: "100%",
            rowGap: "12px",
            columnGap: "16px",
          }}
        >
          <SlideSectionCol title="About 스터디 소모임" subTitle="함께 공부하며 성장하는 스터디">
            <HomeGroupCol threeGroups={groups?.develop.slice(0, 3)} type="study1" />
          </SlideSectionCol>
          <SlideSectionCol title="About 스터디 소모임" subTitle="함께 공부하며 성장하는 스터디">
            <HomeGroupCol threeGroups={groups?.develop.slice(3)} type="self" />
          </SlideSectionCol>
        </motion.div>
      </AnimatePresence>
      <AnimatePresence initial={false}>
        <motion.div
          drag="x"
          dragConstraints={{ left: -width, right: 0 }}
          dragElastic={0.3}
          style={{ marginLeft: "20px", display: "flex", width: "100%", gap: "16px" }}
        >
          <SlideSectionCol
            title="About 취향저격 소모임"
            subTitle="아는 사람만 아는, 그 취향 그대로"
          >
            <HomeGroupCol threeGroups={groups?.hobby2.slice(0, 3)} type="study1" />
          </SlideSectionCol>
          <SlideSectionCol
            title="About 취향저격 소모임"
            subTitle="아는 사람만 아는, 그 취향 그대로"
          >
            <HomeGroupCol threeGroups={groups?.hobby2.slice(3, 6)} type="self" />
          </SlideSectionCol>
        </motion.div>
      </AnimatePresence>
      {/* <Flex direction="column" mx={5} mt={5}>
        <SectionHeader title="About 시험 스터디" subTitle="시험 성공의 지름길"></SectionHeader>
        <HomeGroupCol threeGroups={groups?.exam} type="study2" />
      </Flex> */}
    </Box>
  );
}

export default HomeGroupSection;
