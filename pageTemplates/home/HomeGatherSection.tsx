import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import ButtonWrapper from "../../components/atoms/ButtonWrapper";
import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import HomeGatherCol from "./HomeGatherCol";

function HomeGatherSection() {
  const { data: session } = useSession();

  return (
    <Box my={5}>
      <Box data-joyride-step="gather-section">
        <SectionHeader title="About 소셜링" subTitle="Meeting">
          <ButtonWrapper
            size="xs"
            url={`/gather?location=${convertLocationLangTo(session?.user.location, "en")}`}
          >
            <ShortArrowIcon dir="right" />
          </ButtonWrapper>
        </SectionHeader>
      </Box>
      <HomeGatherCol />
    </Box>
  );
}

export default HomeGatherSection;
