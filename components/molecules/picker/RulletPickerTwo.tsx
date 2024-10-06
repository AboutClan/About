import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";

import RulletPicker from "../../atoms/RulletPicker";
interface IRulletPickerTwo {
  leftRulletArr: string[];
  rightRulletArr: string[];
  rulletIndex: {
    left: number;
    right: number;
  };
  setRulletIndex: Dispatch<
    SetStateAction<{
      left: number;
      right: number;
    }>
  >;
}
export default function RulletPickerTwo({
  rulletIndex,
  leftRulletArr,
  rightRulletArr,
  setRulletIndex,
}: IRulletPickerTwo) {
  return (
    <Layout>
      <Wrapper>
        <RulletPicker
          text="시작 시간"
          rulletItemArr={leftRulletArr}
          rulletIndex={rulletIndex.left}
          setRulletIndex={(idx: number) => setRulletIndex((old) => ({ ...old, left: idx }))}
        />
      </Wrapper>
      <Wrapper>
        <RulletPicker
          text="종료 시간"
          rulletItemArr={rightRulletArr}
          rulletIndex={rulletIndex.right}
          setRulletIndex={(idx: number) => setRulletIndex((old) => ({ ...old, right: idx }))}
        />
      </Wrapper>
    </Layout>
  );
}

const Layout = styled.div`
  width: 100%;
  display: flex;
  > div:first-child {
    margin-right: 16px;
  }
`;

const Wrapper = styled.div`
  flex: 1;
`;
