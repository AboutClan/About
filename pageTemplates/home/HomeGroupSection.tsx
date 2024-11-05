import { Box } from "@chakra-ui/react";

import ButtonWrapper from "../../components/atoms/ButtonWrapper";
import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import HomeGroupCol from "./HomeGroupCol";

function HomeGroupSection() {
  return (
    <Box my={5}>
      <SectionHeader title="About 소모임" subTitle="Group">
        <ButtonWrapper size="xs" url={`/group`}>
          <ShortArrowIcon dir="right" />
        </ButtonWrapper>
      </SectionHeader>
      <HomeGroupCol />
    </Box>
  );
}

export default HomeGroupSection;
