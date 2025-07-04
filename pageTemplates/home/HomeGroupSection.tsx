import { Box, Flex } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";

import SectionHeader from "../../components/atoms/SectionHeader";
import SlideSectionCol from "../../components/molecules/SlideSectionCol";
import { useWindowWidth } from "../../hooks/custom/CustomHooks";
import { useGroupSnapshotQuery } from "../../hooks/groupStudy/queries";
import { shuffleArray } from "../../utils/convertUtils/convertDatas";
import HomeGroupCol from "./HomeGroupCol";

function HomeGroupSection() {
  const { data: groups } = useGroupSnapshotQuery();

  const windowWidth = useWindowWidth(); // 현재 화면 너비 가져오기
  const width = windowWidth - 70;

  return (
    <Box mb={10}>
      <AnimatePresence initial={false}>
        <motion.div
          drag="x"
          dragConstraints={{ left: -width, right: 0 }}
          dragElastic={0.3}
          style={{ marginLeft: "20px", display: "flex", width: "100%", gap: "12px" }}
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
          style={{ marginLeft: "20px", display: "flex", width: "100%", gap: "12px" }}
        >
          <SlideSectionCol title="About 성장 스터디" subTitle="함께 공부하며 만들어가는 성장">
            <HomeGroupCol threeGroups={groups?.develop.slice(0, 3)} type="study1" />
          </SlideSectionCol>
          <SlideSectionCol title="About 자기계발 소모임" subTitle="이번 주부터 갓생 시작">
            <HomeGroupCol threeGroups={groups?.develop.slice(3)} type="self" />
          </SlideSectionCol>
        </motion.div>
      </AnimatePresence>
      <AnimatePresence initial={false}>
        <motion.div
          drag="x"
          dragConstraints={{ left: -width, right: 0 }}
          dragElastic={0.3}
          style={{ marginLeft: "20px", display: "flex", width: "100%", gap: "12px" }}
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
      <Flex direction="column" mx={5} mt={5}>
        <SectionHeader
          title="About 오픈 예정 소모임"
          subTitle="새로운 만남을 준비 중"
        ></SectionHeader>
        <HomeGroupCol threeGroups={shuffleArray(groups?.waiting.slice(0, 3))} type="expected" />
      </Flex>
    </Box>
  );
}

export default HomeGroupSection;
