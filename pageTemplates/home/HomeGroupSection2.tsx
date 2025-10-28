import { Box, Flex } from "@chakra-ui/react";

import SectionHeader from "../../components/atoms/SectionHeader";
import { useGroupSnapshotQuery } from "../../hooks/groupStudy/queries";
import { shuffleArray } from "../../utils/convertUtils/convertDatas";
import HomeGroupCol from "./HomeGroupCol";

function HomeGroupSection2() {
  const { data: groups } = useGroupSnapshotQuery();

  // const windowWidth = useWindowWidth(); // 현재 화면 너비 가져오기
  // const width = windowWidth - 70;

  return (
    <Box mb="60px">
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

export default HomeGroupSection2;
