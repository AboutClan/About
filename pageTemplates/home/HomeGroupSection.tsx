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
  console.log(2, groups);
  return (
    <>
      <Box my={5}>
        <SectionHeader title="About 취미 소모임" subTitle="Group">
          <ButtonWrapper size="xs" url="/group">
            <ShortArrowIcon dir="right" size="sm" />
          </ButtonWrapper>
        </SectionHeader>
        <HomeGroupCol threeGroups={groups?.hobby} />
      </Box>
      <Box my={5}>
        <SectionHeader title="About 자기계발 소모임" subTitle="Group">
          <ButtonWrapper size="xs" url="/group">
            <ShortArrowIcon dir="right" size="sm" />
          </ButtonWrapper>
        </SectionHeader>
        <HomeGroupCol threeGroups={groups?.development} />
      </Box>
      <Box my={5}>
        <SectionHeader title="About 지속 성장 스터디" subTitle="Group">
          <ButtonWrapper size="xs" url="/group">
            <ShortArrowIcon dir="right" size="sm" />
          </ButtonWrapper>
        </SectionHeader>
        <HomeGroupCol threeGroups={groups?.study} />
      </Box>
      <Box my={5}>
        <SectionHeader title="About 시험 준비 스터디" subTitle="Group">
          <ButtonWrapper size="xs" url="/group">
            <ShortArrowIcon dir="right" size="sm" />
          </ButtonWrapper>
        </SectionHeader>
        <HomeGroupCol threeGroups={groups?.exam} />
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
