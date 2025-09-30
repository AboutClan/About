import { Box } from "@chakra-ui/react";

import SlideSectionCol from "../../components/molecules/SlideSectionCol";
import { useWindowWidth } from "../../hooks/custom/CustomHooks";
import { useGroupSnapshotQuery } from "../../hooks/groupStudy/queries";
import HomeGroupCol from "./HomeGroupCol";

function HomeGroupSection() {
  const { data: groups } = useGroupSnapshotQuery();

  const windowWidth = useWindowWidth(); // 현재 화면 너비 가져오기
  const width = windowWidth - 70;

  console.log(42, groups);

  const test = groups?.filter((group) => group.id === 136 || group.id === 118);
  console.log(5, test);
  return (
    <Box mb={10} mx={5}>
      <SlideSectionCol title="취미 소모임" subTitle="아는 사람만 아는, 그 취향 그대로">
        <HomeGroupCol threeGroups={test || []} type="study1" />
      </SlideSectionCol>

      {/* <Flex direction="column" mx={5} mt={5}>
        <SectionHeader title="About 시험 스터디" subTitle="시험 성공의 지름길"></SectionHeader>
        <HomeGroupCol threeGroups={groups?.exam} type="study2" />
      </Flex> */}
    </Box>
  );
}

export default HomeGroupSection;
