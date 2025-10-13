import {
  Box,
  Flex,
  RangeSlider as ChakraRangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import styled from "styled-components";

import { DispatchType } from "../../types/hooks/reactTypes";

interface RangeSliderProps {
  defaultNums: number[];
  setNums: DispatchType<number[]>;
  numberArr: number[];
  isNumber?: boolean;
}

function RangeSlider({ defaultNums, setNums, numberArr, isNumber = true }: RangeSliderProps) {
  return (
    <>
      <Layout initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
        <ChakraRangeSlider
          value={defaultNums}
          min={numberArr[0]}
          max={numberArr.slice(-1)[0]}
          step={1}
          width="97%"
          alignSelf="center"
          onChange={(value) => setNums(value)}
        >
          <RangeSliderTrack bg="var(--gray-400)">
            <RangeSliderFilledTrack bg="var(--color-mint)" />
          </RangeSliderTrack>
          <RangeSliderThumb
            boxSize={4}
            index={0}
            bg="gray.200"
            border="var(--border-main)"
            _focus={{ boxShadow: "none" }}
          />
          <RangeSliderThumb
            boxSize={4}
            index={1}
            bg="gray.200"
            border="var(--border-main)"
            _focus={{ boxShadow: "none" }}
          />
        </ChakraRangeSlider>
        <Flex justify="space-between" mt={3}>
          {numberArr.map((num, idx) => (
            <Box color="gray.600" fontSize="12px" key={num}>
              {!isNumber && idx === 0 ? "범위" : num}
              {!isNumber && idx !== 0 && "단계"}
            </Box>
          ))}
        </Flex>
      </Layout>
    </>
  );
}
const Layout = styled(motion.div)`
  margin: 0 var(--gap-1);
  display: flex;
  flex-direction: column;
`;
export default RangeSlider;
