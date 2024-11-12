import { Box } from "@chakra-ui/react";

import ButtonWrapper from "../../components/atoms/ButtonWrapper";
import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import { useGroupSnapshotQuery } from "../../hooks/groupStudy/queries";
import HomeGroupCol from "./HomeGroupCol";

function HomeGroupSection() {
  const { data: data } = useGroupSnapshotQuery();

  return (
    <>
      <Box my={5}>
        <SectionHeader title="About 오프라인 소모임" subTitle="Group">
          <ButtonWrapper size="xs" url="/group">
            <ShortArrowIcon dir="right" />
          </ButtonWrapper>
        </SectionHeader>
        <HomeGroupCol threeGroups={data?.offline} />
      </Box>
      <Box my={5}>
        <SectionHeader title="About 온라인 소모임" subTitle="Group">
          <ButtonWrapper size="xs" url="/group">
            <ShortArrowIcon dir="right" />
          </ButtonWrapper>
        </SectionHeader>
        <HomeGroupCol threeGroups={data?.online} />
      </Box>
    </>
  );
}

export default HomeGroupSection;
