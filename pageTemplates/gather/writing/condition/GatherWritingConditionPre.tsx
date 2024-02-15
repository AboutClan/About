import { Button } from "@chakra-ui/react";
import styled from "styled-components";
import { CopyBtn } from "../../../../components/common/Icon/CopyIcon";
import CountNum from "../../../../components/features/atoms/CountNum";
import { DispatchNumber } from "../../../../types/reactTypes";

interface IGatherWritingConditionPre {
  preCnt: number;
  setPreCnt: DispatchNumber;
  password: string;
}

function GatherWritingConditionPre({
  preCnt,
  setPreCnt,
  password,
}: IGatherWritingConditionPre) {
  return (
    <Layout>
      <PreMember>
        <CountNum
          value={preCnt}
          setValue={setPreCnt}
          unit="명"
          isSmall={true}
        />
      </PreMember>
      <div>
        <span>암호키</span>
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
      color: var(--gray-4);
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
