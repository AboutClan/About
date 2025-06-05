import { Button } from "@chakra-ui/react";
import styled from "styled-components";

import CountNum from "../../../../components/atoms/CountNum";
import { CopyBtn } from "../../../../components/Icons/CopyIcon";
import { DispatchNumber } from "../../../../types/hooks/reactTypes";

interface IGatherWritingConditionPre {
  preCnt: number;
  setPreCnt: DispatchNumber;
  password: string;
}

function GatherWritingConditionPre({ preCnt, setPreCnt, password }: IGatherWritingConditionPre) {
  return (
    <Layout>
      <PreMember>
        <CountNum value={preCnt} setValue={setPreCnt} unit="명" isSmall={true} />
      </PreMember>
      <div>
        <span>초대코드</span>
        <Button size="sm" disabled colorScheme="blackAlpha" mr="8px">
          {password}
        </Button>
        <CopyBtn text={password} />
      </div>
    </Layout>
  );
}

const Layout = styled.div`
  margin-top: var(--gap-3);
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  > div:last-child {
    display: flex;
    align-items: center;
    > span {
      color: var(--gray-500);
      margin-right: var(--gap-2);
    }
  }
`;
const PreMember = styled.div`
  display: flex;
  align-items: center;
  > div {
    margin-right: var(--gap-2);
    > span {
      margin: 0 var(--gap-2);
    }
  }
`;

export default GatherWritingConditionPre;
