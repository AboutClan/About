import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import ButtonWrapper from "../../components/atoms/ButtonWrapper";
import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import { useGatherQuery } from "../../hooks/gather/queries";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import HomeGatherCol from "./HomeGatherCol";

function HomeGatherSection() {
  const { data: session } = useSession();

  const { data: gathers } = useGatherQuery(-1);

  return (
    <>
      <Box my={5}>
        <SectionHeader title="About 번개 모임 1" subTitle="친구들과의 즐거운 만남">
          <ButtonWrapper
            size="xs"
            url={`/gather?location=${convertLocationLangTo(session?.user.location, "en")}`}
          >
            <ShortArrowIcon size="sm" dir="right" />
          </ButtonWrapper>
        </SectionHeader>
        <HomeGatherCol gathers={gathers?.slice(0, 3)} />
      </Box>
      <Box my={5}>
        <SectionHeader title="About 번개 모임 2" subTitle="같은 관심사를 나누는 만남의 장">
          <ButtonWrapper
            size="xs"
            url={`/gather?location=${convertLocationLangTo(session?.user.location, "en")}`}
          >
            <ShortArrowIcon size="sm" dir="right" />
          </ButtonWrapper>
        </SectionHeader>
        <HomeGatherCol gathers={gathers?.slice(3)} />
      </Box>
    </>
  );
}

export default HomeGatherSection;
