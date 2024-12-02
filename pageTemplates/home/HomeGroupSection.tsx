import { Box } from "@chakra-ui/react";

import ButtonWrapper from "../../components/atoms/ButtonWrapper";
import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import { GroupShapShotProps } from "../../hooks/groupStudy/queries";
import HomeGroupCol from "./HomeGroupCol";

interface HomeGroupSectionProps {
  groups: GroupShapShotProps;
}

function HomeGroupSection({ groups }: HomeGroupSectionProps) {
  return (
    <>
      <Box my={5}>
        <SectionHeader title="About 오프라인 소모임" subTitle="Group">
          <ButtonWrapper size="xs" url="/group">
            <ShortArrowIcon dir="right" size="sm" />
          </ButtonWrapper>
        </SectionHeader>
        <HomeGroupCol threeGroups={groups?.offline} />
      </Box>
      <Box my={5}>
        <SectionHeader title="About 온라인 소모임" subTitle="Group">
          <ButtonWrapper size="xs" url="/group">
            <ShortArrowIcon dir="right" size="sm" />
          </ButtonWrapper>
        </SectionHeader>
        <HomeGroupCol threeGroups={groups?.online} />
      </Box>
      <Box my={5}>
        <SectionHeader title="About 신규 소모임" subTitle="Group">
          <ButtonWrapper size="xs" url="/group">
            <ShortArrowIcon dir="right" size="sm" />
          </ButtonWrapper>
        </SectionHeader>
        <HomeGroupCol threeGroups={groups?.new.slice().reverse()} />
      </Box>
      <Box my={5}>
        <SectionHeader title="About 오픈 예정 소모임" subTitle="Group">
          <ButtonWrapper size="xs" url="/group">
            <ShortArrowIcon dir="right" size="sm" />
          </ButtonWrapper>
        </SectionHeader>
        <HomeGroupCol threeGroups={groups?.waiting} />
      </Box>
    </>
  );
}

export default HomeGroupSection;
