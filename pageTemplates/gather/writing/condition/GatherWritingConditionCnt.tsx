import { Switch } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";
import CountNum from "../../../../components/features/atoms/CountNum";
import { IGatherMemberCnt } from "../../../../types/page/gather";
import { DispatchType } from "../../../../types/reactTypes";

interface IGatherWritingConditionCnt {
  isMin: boolean;
  value: number;
  setMemberCnt: DispatchType<IGatherMemberCnt>;
  defaultBoolean?: boolean;
}

function GatherWritingConditionCnt({
  isMin,
  value,
  setMemberCnt,
  defaultBoolean,
}: IGatherWritingConditionCnt) {
  const [isMaxLimit, setIsMaxLimit] = useState(defaultBoolean ?? !isMin);
  const [number, setNumber] = useState(value);

  useEffect(() => {
    if (isMin) setMemberCnt((old) => ({ ...old, min: number }));
    else setMemberCnt((old) => ({ ...old, max: number }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number]);

  const toggleSwitch = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    if (!isChecked) {
      setMemberCnt((old) => ({ ...old, max: 4 }));
      setNumber(4);
    } else setMemberCnt((old) => ({ ...old, max: 0 }));
    setIsMaxLimit(isChecked);
  };

  return (
    <Layout>
      <MemberCnt>
        {!isMin && (
          <Switch
            colorScheme="mintTheme"
            isChecked={isMaxLimit}
            onChange={toggleSwitch}
            mr="16px"
          />
        )}
        {!isMaxLimit ? (
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

const CounterWrapper = styled.div<{ isMinus: boolean }>`
  padding: 0 var(--gap-1);
  margin-right: ${(props) => (props.isMinus ? "var(--gap-1)" : 0)};
  margin-left: ${(props) => (!props.isMinus ? "var(--gap-1)" : 0)};
  cursor: pointer;
`;

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
