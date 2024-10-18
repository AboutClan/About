import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import { DispatchType } from "../../types/hooks/reactTypes";

interface IStatisticsTabNav {
  setTabValue: DispatchType<"전체 랭킹" | "내 통계">;
}
export default function StatisticsTabNav({ setTabValue }: IStatisticsTabNav) {
  const tabNavOptionsArr: ITabNavOptions[] = [
    {
      text: "전체 랭킹",
      func: () => setTabValue("전체 랭킹"),
    },
    {
      text: "내 통계",
      func: () => setTabValue("내 통계"),
    },
  ];
  return <TabNav tabOptionsArr={tabNavOptionsArr} isFullSize />;
}
