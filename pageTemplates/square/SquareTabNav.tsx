import { Box } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";

import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";

interface SquareTabNavProps {
  tab: SquareTab;
}

export type SquareTab = "시크릿 스퀘어" | "라운지";

function SquareTabNav({ tab }: SquareTabNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const tabNavOptions: ITabNavOptions[] = [
    {
      text: "시크릿 스퀘어",
      func: () => {
        newSearchParams.set("tab", "secret");
        router.replace("square" + "?" + newSearchParams.toString());
      },
    },
    {
      text: "라운지",
      func: () => {
        newSearchParams.set("tab", "lounge");
        router.replace("square" + "?" + newSearchParams.toString());
      },
    },
  ];

  return (
    <Box fontSize="16px" pt="8px" bgColor="white">
      <TabNav tabOptionsArr={tabNavOptions} selected={tab} hasBorder={false} isThick />
    </Box>
  );
}

export default SquareTabNav;
