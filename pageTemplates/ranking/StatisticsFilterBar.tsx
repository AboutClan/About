import { Box, Flex, Switch } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Selector from "../../components/atoms/Selector";
import { IUserRankings } from "../../libs/userEventLibs/userHelpers";
import { RankingCategoryProp, RankingFilterOptionProps } from "../../pages/ranking/ranking";
import { DispatchType } from "../../types/hooks/reactTypes";

interface IStatisticsFilterBar {
  filterOption: RankingFilterOptionProps;
  categoryArr: string[];
  setFilterOption: DispatchType<RankingFilterOptionProps>;
  setUsersRanking: DispatchType<IUserRankings>;
}

export default function StatisticsFilterBar({
  categoryArr,
  filterOption,
  setFilterOption,
  setUsersRanking,
}: IStatisticsFilterBar) {
  const { data: session } = useSession();

  const [value, setValue] = useState<string>(filterOption.category);

  useEffect(() => {
    setUsersRanking(null);
    setFilterOption((old) => ({ ...old, category: value as RankingCategoryProp }));
  }, [value]);

  return (
    <Flex justify="space-between" p="12px 20px" mr="4px" align="center">
      <Selector
        defaultValue={filterOption.category}
        options={categoryArr}
        setValue={setValue}
        isBorder={true}
      />
      <Flex align="center">
        <Box color={!filterOption.isLocationFilter ? "var(--gray-500)" : "var(--gray-800)"}>
          {session?.user.location}
        </Box>
        <Switch
          onChange={() =>
            setFilterOption((old) => ({ ...old, isLocationFilter: !old.isLocationFilter }))
          }
          isChecked={!filterOption.isLocationFilter}
          m="0 8px"
          colorScheme="mintTheme"
        />
        <Box color={filterOption.isLocationFilter ? "var(--gray-500)" : "var(--gray-800)"}>
          전체
        </Box>
      </Flex>
    </Flex>
  );
}
