import { Box } from "@chakra-ui/react";

import SlideSectionCol from "../../components/molecules/SlideSectionCol";
import SlideSectionRow from "../../components/molecules/SlideSectionRow";
import { useGroupSnapshotQuery } from "../../hooks/groupStudy/queries";
import HomeGroupCol from "./HomeGroupCol";

function HomeGroupSection() {
  const { data: groups } = useGroupSnapshotQuery();

  return (
    <Box>
      <SlideSectionRow gap="16px">
        <SlideSectionCol
          title="관심사로 통하는 About 취미 소모임"
          subTitle="같은 관심사 친구들과 지속적인 모임"
        >
          <HomeGroupCol threeGroups={groups?.hobby.slice(0, 3)} type="hobby" />
        </SlideSectionCol>
        <SlideSectionCol
          title="관심사로 통하는 About 취미 소모임"
          subTitle="같은 관심사 친구들과 지속적인 모임"
        >
          <HomeGroupCol threeGroups={groups?.hobby.slice(3, 6)} type="hobby" />
        </SlideSectionCol>
      </SlideSectionRow>
      <SlideSectionRow gap="16px">
        <SlideSectionCol
          title="2026년을 바꾸는 About 스터디!"
          subTitle="공부·자기계발·루틴까지 함께 쌓아가는 모임"
        >
          <HomeGroupCol threeGroups={groups?.develop.slice(0, 3)} type="develop" />
        </SlideSectionCol>
        <SlideSectionCol
          title="2026년을 바꾸는 About 스터디!"
          subTitle="공부·자기계발·루틴까지 함께 쌓아가는 모임"
        >
          <HomeGroupCol threeGroups={groups?.develop.slice(3)} type="develop" />
        </SlideSectionCol>
      </SlideSectionRow>
      <SlideSectionRow gap="16px">
        <SlideSectionCol
          title="우리 동네 스터디 크루"
          subTitle="동네에서 편하게 모여 같이 카공하는 모임"
        >
          <HomeGroupCol threeGroups={groups?.crew.slice(0, 3)} type="crew" />
        </SlideSectionCol>
        <SlideSectionCol
          title="우리 동네 스터디 크루"
          subTitle="동네에서 편하게 모여 같이 카공하는 모임"
        >
          <HomeGroupCol threeGroups={groups?.crew.slice(3)} type="crew" />
        </SlideSectionCol>
      </SlideSectionRow>
      <SlideSectionRow gap="16px">
        <SlideSectionCol
          title="오픈 임박! 신규 개설 소모임"
          subTitle="새로운 만남을 기다리는 신규 소모임"
        >
          <HomeGroupCol threeGroups={groups?.waiting.slice(0, 3)} type="expected" />
        </SlideSectionCol>
        <SlideSectionCol
          title="About 오픈 예정 소모임"
          subTitle="새로운 만남을 기다리는 신규 소모임"
        >
          <HomeGroupCol threeGroups={groups?.waiting.slice(3, 6)} type="expected" />
        </SlideSectionCol>
      </SlideSectionRow>
      {/* <Flex direction="column" mx={5} mt={5}>
        <SectionHeader title="About 시험 스터디" subTitle="시험 성공의 지름길"></SectionHeader>
        <HomeGroupCol threeGroups={groups?.exam} type="study2" />
      </Flex> */}
    </Box>
  );
}

export default HomeGroupSection;
