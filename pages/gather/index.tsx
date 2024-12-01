import { Box } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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
  const tabParam = searchParams.get("tab");
  const { data: session } = useSession();

  const isGuest = session?.user.role === "guest";

  const [tab, setTab] = useState<"번개" | "라운지">("번개");

  useEffect(() => {
    if (tabParam === "gather") setTab("번개");
    if (tabParam === "lounge") setTab("라운지");
  }, [tabParam]);

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
      {!isGuest && <WritingButton url="/gather/writing/category" type="thunder" />}
    </>
  );
}

export default Gather;
