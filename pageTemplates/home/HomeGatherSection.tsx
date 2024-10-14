import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import HomeGatherCol from "./HomeGatherCol";

function HomeGatherSection() {
  const { data: session } = useSession();

  return (
    <Box my={5}>
      <SectionHeader title="About 번개" subTitle="Meeting">
        <Link href={`/gather?location=${convertLocationLangTo(session?.user.location, "en")}`}>
          <ShortArrowIcon dir="right" />
        </Link>
      </SectionHeader>
      <HomeGatherCol />
    </Box>
  );
}

export default HomeGatherSection;
