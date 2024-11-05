import { Box } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import WritingButton from "../../components/atoms/buttons/WritingButton";
import Slide from "../../components/layouts/PageSlide";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import GatherHeader from "../../pageTemplates/gather/GatherHeader";
import GatherMain from "../../pageTemplates/gather/GatherMain";
import SquareLoungeSection from "../../pageTemplates/square/SquareLoungeSection";

function Gather() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const [tab, setTab] = useState<"번개" | "라운지">("번개");

  const tabNavOptions: ITabNavOptions[] = [
    {
      text: "번개",
      func: () => {
        newSearchParams.set("tab", "gather");
        router.replace("gather" + "?" + newSearchParams.toString());
        setTab("번개");
      },
    },
    {
      text: "라운지",
      func: () => {
        newSearchParams.set("tab", "lounge");
        router.replace("gather" + "?" + newSearchParams.toString());
        setTab("라운지");
      },
    },
  ];

  return (
    <>
      <GatherHeader />
      <Slide isNoPadding>
        <Box fontSize="16px" mb={3} bgColor="white">
          <TabNav tabOptionsArr={tabNavOptions} selected={tab} isFullSize />
        </Box>
      </Slide>

      {/**임시 비활성화 */}
      {/* <GatherLocationFilter /> */}
      {tab === "번개" ? <GatherMain /> : <SquareLoungeSection />}

      <WritingButton url="/gather/writing/category" />
    </>
  );
}

export default Gather;
