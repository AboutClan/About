import {
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import styled from "styled-components";

import { DispatchType } from "../../../../types/hooks/reactTypes";

interface IGatherWritingConditionAgeRange {
  age: number[];
  setAge: DispatchType<number[]>;
}

const AGE_BAR = [19, 20, 21, 22, 23, 24, 25, 26, 27, 28];

function GatherWritingConditionAgeRange({ age, setAge }: IGatherWritingConditionAgeRange) {
  return (
    <Layout initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
      <RangeSlider
        value={age}
        min={AGE_BAR[0]}
        max={AGE_BAR.slice(-1)[0]}
        step={1}
        width="97%"
        alignSelf="center"
        onChange={(value) => setAge(value)}
      >
        <RangeSliderTrack bg="var(--gray-5)">
          <RangeSliderFilledTrack bg="var(--color-mint)" />
        </RangeSliderTrack>
        <RangeSliderThumb boxSize={6} index={0} />
        <RangeSliderThumb boxSize={6} index={1} />
      </RangeSlider>
      <AgeText>
        {AGE_BAR.map((num) => (
          <Age key={num}>{num}</Age>
        ))}
      </AgeText>
    </Layout>
  );
}

const Layout = styled(motion.div)`
  margin: 0 var(--gap-1);
  margin-top: var(--gap-3);
  display: flex;
  flex-direction: column;
`;
const AgeText = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Age = styled.span``;

export default GatherWritingConditionAgeRange;
