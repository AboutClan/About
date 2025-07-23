import {
  Box,
  Button,
  Flex,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface IGatherWritingConditionAgeRange {
  age: number[];
  setAge: (ageRange: number[]) => void;
}

export type GatherAgeSection =
  | "상관 없음"
  | "20대 초반"
  | "20대 초중반"
  | "20대 중반"
  | "20대 중후반";

const AGE_BAR = [19, 20, 21, 22, 23, 24, 25, 26, 27, 28];

function GatherWritingConditionAgeRange({ age, setAge }: IGatherWritingConditionAgeRange) {
  const [buttonText, setButtonText] = useState<GatherAgeSection>("상관 없음");

  const buttonArr: GatherAgeSection[] = [
    "상관 없음",
    "20대 초반",
    "20대 초중반",
    "20대 중반",
    "20대 중후반",
  ];

  useEffect(() => {
    switch (buttonText) {
      case "상관 없음":
        setAge([19, 28]);
        return;
      case "20대 초반":
        setAge([19, 22]);
        return;
      case "20대 초중반":
        setAge([19, 25]);
        return;
      case "20대 중반":
        setAge([22, 26]);
        return;
      case "20대 중후반":
        setAge([23, 28]);
        return;
    }
  }, [buttonText]);

  return (
    <>
      <Flex justify="space-between" mt={1} mb={5}>
        {buttonArr.map((text) => (
          <Button
            onClick={() => setButtonText(text)}
            size="sm"
            key={text}
            colorScheme={text === buttonText ? "mint" : "gray"}
          >
            {text}
          </Button>
        ))}
      </Flex>
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
        </RangeSlider>
        <Flex justify="space-between" mt={3}>
          {AGE_BAR.map((num) => (
            <Box color="gray.600" fontSize="12px" key={num}>
              {num}
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

export default GatherWritingConditionAgeRange;
