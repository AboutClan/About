import { Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import RangeSlider from "../../../../components/molecules/RangeSlider";

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
      <RangeSlider defaultNums={age} setNums={setAge} numberArr={AGE_BAR} />
    </>
  );
}

export default GatherWritingConditionAgeRange;
