import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";

import RulletPicker from "../../atoms/RulletPicker";
interface IRulletPickerTwo {
  leftDefaultIdx: number;
  rightDefaultIdx: number;
  leftRulletArr: string[];
  rightRulletArr: string[];
  setRulletValue: Dispatch<
    SetStateAction<{
      left: string;
      right: string;
    }>
  >;
}
export default function RulletPickerTwo({
  leftDefaultIdx,
  rightDefaultIdx,
  leftRulletArr,
  rightRulletArr,
  setRulletValue,
}: IRulletPickerTwo) {
  const [rulletIndex, setRulletIndex] = useState<{
    start: number;
    end: number;
  }>({ start: leftDefaultIdx, end: rightDefaultIdx });

  useEffect(() => {
    setRulletValue({
      left: leftRulletArr[rulletIndex.start],
      right: rightRulletArr[rulletIndex.end],
    });
  }, [rulletIndex]);

  return (
    <Layout>
      <Wrapper>
        <RulletPicker
          text="시작 시간"
          rulletItemArr={leftRulletArr}
          rulletIndex={rulletIndex.start}
          setRulletIndex={(idx: number) => setRulletIndex((old) => ({ ...old, start: idx }))}
        />
      </Wrapper>
      <Wrapper>
        <RulletPicker
          text="종료 시간"
          rulletItemArr={rightRulletArr}
          rulletIndex={rulletIndex.end}
          setRulletIndex={(idx: number) => setRulletIndex((old) => ({ ...old, end: idx }))}
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
