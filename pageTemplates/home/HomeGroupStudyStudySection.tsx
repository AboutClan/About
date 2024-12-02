import { Box } from "@chakra-ui/react";

import ButtonWrapper from "../../components/atoms/ButtonWrapper";
import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import { GroupShapShotProps } from "../../hooks/groupStudy/queries";
import HomeGroupCol from "./HomeGroupCol";

interface HomeGroupStudySectionProps {
  groups: GroupShapShotProps;
}

function HomeGroupStudySection({ groups }: HomeGroupStudySectionProps) {
  return (
    <>
      <Box my={5}>
        <SectionHeader title="About 시험기간 챌린지" subTitle="Study Challenge">
          <ButtonWrapper size="xs" url="/group">
            <ShortArrowIcon dir="right" size="sm" />
          </ButtonWrapper>
        </SectionHeader>
        <HomeGroupCol
          threeGroups={groups?.study?.sort((a) => (a.status === "pending" ? 1 : -1))}
          isStudy
        />
      </Box>
    </>
  );
}

export default HomeGroupStudySection;
