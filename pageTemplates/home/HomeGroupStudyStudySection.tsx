import { Box } from "@chakra-ui/react";

import ButtonWrapper from "../../components/atoms/ButtonWrapper";
import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import { useGroupOnlyStudyQuery } from "../../hooks/groupStudy/queries";
import HomeGroupCol from "./HomeGroupCol";

function HomeGroupStudySection() {
  const { data: data } = useGroupOnlyStudyQuery();
  console.log(data);
  return (
    <>
      <Box my={5}>
        <SectionHeader title="About 시험기간 챌린지" subTitle="Study Challenge">
          <ButtonWrapper size="xs" url="/group">
            <ShortArrowIcon dir="right" />
          </ButtonWrapper>
        </SectionHeader>
        <HomeGroupCol threeGroups={data?.study?.slice().reverse()} />
      </Box>
    </>
  );
}

export default HomeGroupStudySection;
