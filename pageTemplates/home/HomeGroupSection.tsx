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
        <Box data-joyride-step="offline-group-section">
          <SectionHeader title="About 오프라인 소모임" subTitle="Group">
            <ButtonWrapper size="xs" url="/group">
              <ShortArrowIcon dir="right" />
            </ButtonWrapper>
          </SectionHeader>
        </Box>
        <HomeGroupCol threeGroups={groups?.offline} />
      </Box>
      <Box my={5}>
        <Box data-joyride-step="online-group-section">
          <SectionHeader title="About 온라인 소모임" subTitle="Group">
            <ButtonWrapper size="xs" url="/group">
              <ShortArrowIcon dir="right" />
            </ButtonWrapper>
          </SectionHeader>
        </Box>
        <HomeGroupCol threeGroups={groups?.online} />
      </Box>
      <Box my={5}>
        <Box data-joyride-step="new-group-section">
          <SectionHeader title="About 신규 소모임" subTitle="Group">
            <ButtonWrapper size="xs" url="/group">
              <ShortArrowIcon dir="right" />
            </ButtonWrapper>
          </SectionHeader>
        </Box>
        <HomeGroupCol threeGroups={groups?.new.slice().reverse()} />
      </Box>
      <Box my={5}>
        <Box data-joyride-step="opened-group-section">
          <SectionHeader title="About 오픈 예정 소모임" subTitle="Group">
            <ButtonWrapper size="xs" url="/group">
              <ShortArrowIcon dir="right" />
            </ButtonWrapper>
          </SectionHeader>
        </Box>
        <HomeGroupCol threeGroups={groups?.waiting} />
      </Box>
    </>
  );
}

export default HomeGroupSection;
