import { Box } from "@chakra-ui/react";

import ButtonWrapper from "../../components/atoms/ButtonWrapper";
import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";

function HomeGroupStudySection() {
  return (
    <>
      <Box my={5}>
        <SectionHeader title="About 신규 콘텐츠" subTitle="Winter season">
          <ButtonWrapper size="xs" url="/group?filter=pending&category=10">
            <ShortArrowIcon dir="right" size="sm" />
          </ButtonWrapper>
        </SectionHeader>
        {/* <HomeGroupCol
          threeGroups={groups?.contents?.sort((a) => (a.status === "pending" ? 1 : -1))}
          isStudy
        /> */}
      </Box>
    </>
  );
}

export default HomeGroupStudySection;
