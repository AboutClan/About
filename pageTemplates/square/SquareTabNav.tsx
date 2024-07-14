import { Box } from "@chakra-ui/react";

import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import { DispatchType } from "../../types/hooks/reactTypes";

interface SquareTabNavProps {
  tab: SquareTab;
  setTab: DispatchType<SquareTab>;
}

export type SquareTab = "시크릿 스퀘어" | "라운지";

function SquareTabNav({ tab, setTab }: SquareTabNavProps) {
  const tabNavOptions: ITabNavOptions[] = [
    {
      text: "시크릿 스퀘어",
      func: () => setTab("시크릿 스퀘어"),
    },
    {
      text: "라운지",
      func: () => setTab("라운지"),
    },
  ];

  return (
    <Box fontSize="16px" pt="8px" bgColor="white">
      <TabNav tabOptionsArr={tabNavOptions} selected={tab} hasBorder={false} isThick />
    </Box>
  );
}

export default SquareTabNav;
