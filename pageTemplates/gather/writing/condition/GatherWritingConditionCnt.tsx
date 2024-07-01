import { Switch } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";

import CountNum from "../../../../components/atoms/CountNum";
import { DispatchType } from "../../../../types/hooks/reactTypes";
import { IGatherMemberCnt } from "../../../../types/models/gatherTypes/gatherTypes";

interface IGatherWritingConditionCnt {
  isMin: boolean;
  value: number;
  setMemberCnt: DispatchType<IGatherMemberCnt>;
}

function GatherWritingConditionCnt({ isMin, value, setMemberCnt }: IGatherWritingConditionCnt) {
  const [number, setNumber] = useState(value);

  useEffect(() => {
    if (isMin) setMemberCnt((old) => ({ ...old, min: number }));
    else setMemberCnt((old) => ({ ...old, max: number }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number]);

  const toggleSwitch = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setMemberCnt((old) => ({ ...old, max: 4 }));
      setNumber(4);
    } else setMemberCnt((old) => ({ ...old, max: 0 }));
  };

  return (
    <Layout>
      <MemberCnt>
        {!isMin && (
          <Switch
            colorScheme="mintTheme"
            isChecked={value !== 0}
            onChange={toggleSwitch}
            mr="16px"
          />
        )}
        {value !== 0 ? (
          <CountNum
            value={number}
            setValue={setNumber}
            unit="명"
            min={!isMin ? 4 : undefined}
            isSmall={true}
          />
        ) : (
          <MaxConditionText>제한 없음</MaxConditionText>
        )}
      </MemberCnt>
    </Layout>
  );
}

const Layout = styled.div``;

const MemberCnt = styled.div`
  display: flex;
  align-items: center;
`;

const MaxConditionText = styled.div`
  width: 66px;
  text-align: center;
  margin-right: var(--gap-1);
`;
export default GatherWritingConditionCnt;
