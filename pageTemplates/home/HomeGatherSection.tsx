import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import SectionHeader from "../../components/atoms/SectionHeader";
import HomeGatherCol from "./HomeGatherCol";

interface HomeGatherSectionProps {}

function HomeGatherSection({}: HomeGatherSectionProps) {
  return (
    <Box my={5}>
      <SectionHeader title="About 번개" subTitle="Meeting" />
      <HomeGatherCol />
    </Box>
  );
}

export default HomeGatherSection;
