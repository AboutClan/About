import { Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Select from "../../components/atoms/Select";
import { IUserRankings } from "../../libs/userEventLibs/userHelpers";
import { RankingCategoryProp, RankingFilterOptionProps } from "../../pages/ranking";
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
      <Select
        defaultValue={filterOption.category}
        options={categoryArr}
        setValue={setValue}
        size="sm"
      />
    </Flex>
  );
}
