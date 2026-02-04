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
          <SlideSectionCol
            title="겨울 시즌! About 취미 소모임"
            subTitle="겨울 내내 함께 즐기는 취미 활동 모임"
          >
            <HomeGroupCol threeGroups={groups?.hobby.slice(0, 3)} type="hobby" />
          </SlideSectionCol>
          <SlideSectionCol
            title="겨울 시즌! About 취미 소모임"
            subTitle="겨울 내내 함께 즐기는 취미 활동 모임"
          >
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
          <SlideSectionCol
            title="2026년을 바꾸는 About 스터디!"
            subTitle="공부·자기계발·루틴까지 함께 쌓아가는 스터디 모임"
          >
            <HomeGroupCol threeGroups={groups?.develop.slice(0, 3)} type="study1" />
          </SlideSectionCol>
          <SlideSectionCol
            title="2026년을 바꾸는 About 스터디!"
            subTitle="공부·자기계발·루틴까지 함께 쌓아가는 스터디 모임"
          >
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
            title="오픈 임박! 신규 개설 소모임"
            subTitle="새로운 만남을 기다리는 신규 소모임"
          >
            <HomeGroupCol threeGroups={groups?.waiting.slice(0, 3)} type="study1" />
          </SlideSectionCol>
          <SlideSectionCol
            title="About 오픈 예정 소모임"
            subTitle="새로운 만남을 기다리는 신규 소모임"
          >
            <HomeGroupCol threeGroups={groups?.waiting.slice(3, 6)} type="self" />
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
