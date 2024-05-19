import { Select, Switch } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import { DispatchType } from "../../types/hooks/reactTypes";
import { RankingCategory } from "../../types/models/ranking";
import { getMonth } from "../../utils/dateTimeUtils";

interface IRankingCategoryBar {
  category: RankingCategory;
  setCategory: DispatchType<RankingCategory>;
  isLocationFilter: boolean;
  setIsLocationFilter: DispatchType<boolean>;
}

function RankingCategoryBar({
  category,
  setCategory,
  isLocationFilter,
  setIsLocationFilter,
}: IRankingCategoryBar) {
  const { data: session } = useSession();
  const location = session?.user.location;

  const onChange = (e) => {
    setCategory(e.target.value as RankingCategory);
  };
  return (
    <Layout>
      <Select
        size="sm"
        border="none"
        width="max-content"
        _focus={{ border: "none" }}
        value={category}
        onChange={onChange}
        color="var(--gray-900)"
      >
        <Option value="월간">{getMonth() + 1}월 랭킹</Option>
        <Option value="지난">{getMonth()}월 랭킹</Option>
        <Option value="누적">누적 랭킹</Option>
      </Select>
      <SwitchWrapper>
        <SwitchLabel isSelected={!isLocationFilter}>전체</SwitchLabel>
        <Switch
          isChecked={isLocationFilter}
          colorScheme="mintTheme"
          mx="var(--gap-2)"
          onChange={(e) => setIsLocationFilter(e.target.checked)}
        />
        <SwitchLabel isSelected={isLocationFilter}>{location}</SwitchLabel>
      </SwitchWrapper>
    </Layout>
  );
}

const Layout = styled.div`
  margin-left: 5.5px;
  margin-right: var(--gap-4);
  padding: var(--gap-3) 0;
  display: flex;
  align-items: center;

  > span {
    font-weight: 600;
    width: 60px;
    text-align: center;
  }
  > span:first-child {
    margin-right: var(--gap-3);
  }
`;

const Option = styled.option``;

const SwitchWrapper = styled.div`
  margin-left: auto;
`;

const SwitchLabel = styled.span<{ isSelected: boolean }>`
  font-size: 11px;
  color: ${(props) => (props.isSelected ? "var(--gray-900)" : "var(--gray-700)")};
`;

export default RankingCategoryBar;
