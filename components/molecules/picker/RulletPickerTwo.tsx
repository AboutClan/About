import { Box, Flex } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

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
    <Box w="full">
      <Flex w="full" px={5}>
        <Box
          mr={3}
          flex={1}
          textAlign="center"
          lineHeight="12px"
          fontSize="11px"
          fontWeight="semibold"
          my={2}
        >
          시작 시간
        </Box>
        <Box
          flex={1}
          textAlign="center"
          lineHeight="12px"
          fontSize="11px"
          fontWeight="semibold"
          my={2}
        >
          종료 시간
        </Box>
      </Flex>
      <Flex w="full" border="var(--border)" borderRadius="8px" px={5} py={1}>
        <Flex py={2} mr={3} flex={1} direction="column" align="center">
          <RulletPicker
            rulletItemArr={leftRulletArr}
            rulletIndex={rulletIndex.left}
            setRulletIndex={(idx: number) => setRulletIndex((old) => ({ ...old, left: idx }))}
          />
        </Flex>
        <Flex py={2} flex={1} direction="column" align="center">
          <RulletPicker
            rulletItemArr={rightRulletArr}
            rulletIndex={rulletIndex.right}
            setRulletIndex={(idx: number) => setRulletIndex((old) => ({ ...old, right: idx }))}
          />
        </Flex>
      </Flex>
    </Box>
  );
}
