import { Box, Flex, Switch } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Selector from "../../components/atoms/Selector";
import { DispatchType } from "../../types/hooks/reactTypes";

interface IStatisticsFilterBar {
  setFilterOptions: DispatchType<{
    category: string;
    isSwitchOn: boolean;
  }>;
}
const categoryArr = [
  `${dayjs().month()}월 랭킹`,
  `${dayjs().add(1, "month").month()}월 랭킹`,
  "점수 랭킹",
];

export default function StatisticsFilterBar({ setFilterOptions }: IStatisticsFilterBar) {
  const { data: session } = useSession();

  const [category, setCategory] = useState(categoryArr[1]);
  const [isSwitchOn, setIsSwitchOn] = useState(true);

  useEffect(() => {
    setFilterOptions({
      category,
      isSwitchOn,
    });
  }, [category, isSwitchOn]);

  return (
    <Flex justify="space-between" p="8px 16px" mr="4px" align="center">
      <Selector
        defaultValue={category}
        options={categoryArr}
        setValue={setCategory}
        isBorder={false}
      />
      <Flex fontSize="12px" align="center">
        <Box color={isSwitchOn ? "var(--gray-500)" : "var(--gray-900)"}>
          {session?.user.location}
        </Box>
        <Switch
          onChange={() => setIsSwitchOn((old) => !old)}
          isChecked={isSwitchOn}
          m="0 8px"
          colorScheme="mintTheme"
        />
        <Box color={!isSwitchOn ? "var(--gray-700)" : "var(--gray-900)"}>전체</Box>
      </Flex>
    </Flex>
  );
}
