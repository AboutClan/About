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
        <SectionHeader title="About 취미 소모임" subTitle="같은 취미로 이어지는 만남">
          <ButtonWrapper size="xs" url="/group">
            <ShortArrowIcon dir="right" size="sm" />
          </ButtonWrapper>
        </SectionHeader>
        <HomeGroupCol threeGroups={groups?.hobby} />
      </Box>
      <Box my={5}>
        <SectionHeader title="About 자기계발 소모임" subTitle="이번 주부터 갓생 시작">
          <ButtonWrapper size="xs" url="/group">
            <ShortArrowIcon dir="right" size="sm" />
          </ButtonWrapper>
        </SectionHeader>
        <HomeGroupCol threeGroups={groups?.development} />
      </Box>
      <Box my={5}>
        <SectionHeader title="About 지속 성장 스터디" subTitle="함께 공부하며 만들어가는 성장">
          <ButtonWrapper size="xs" url="/group">
            <ShortArrowIcon dir="right" size="sm" />
          </ButtonWrapper>
        </SectionHeader>
        <HomeGroupCol threeGroups={groups?.study} />
      </Box>
      <Box my={5}>
        <SectionHeader title="About 시험 준비 스터디" subTitle="시험 성공의 지름길">
          <ButtonWrapper size="xs" url="/group">
            <ShortArrowIcon dir="right" size="sm" />
          </ButtonWrapper>
        </SectionHeader>
        <HomeGroupCol threeGroups={groups?.exam} />
      </Box>
      <Box my={5}>
        <SectionHeader title="About 신규 소모임" subTitle="지금 가장 주목할 소모임">
          <ButtonWrapper size="xs" url="/group">
            <ShortArrowIcon dir="right" size="sm" />
          </ButtonWrapper>
        </SectionHeader>
        <HomeGroupCol threeGroups={groups?.new.slice().reverse()} />
      </Box>
      <Box my={5}>
        <SectionHeader title="About 오픈 예정 소모임" subTitle="새로운 만남을 준비 중">
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
