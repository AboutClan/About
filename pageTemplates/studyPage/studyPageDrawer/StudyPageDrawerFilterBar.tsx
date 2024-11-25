import { Box, Flex } from "@chakra-ui/react";

import Select from "../../../components/atoms/Select";
import { DispatchType } from "../../../types/hooks/reactTypes";

interface StudyPageDrawerFilterBarProps {
  placeCnt: number;

  selectOption: "인원순" | "거리순" | "선호순";
  setSelectOption: DispatchType<"인원순" | "거리순" | "선호순">;
}

function StudyPageDrawerFilterBar({
  placeCnt,
  selectOption,
  setSelectOption,
}: StudyPageDrawerFilterBarProps) {
  const selectOptionArr = ["인원순", "거리순", "선호순"];

  return (
    <Flex justify="space-between" lineHeight="16px" my={4}>
      <Box fontSize="12px">
        전체 <b style={{ color: "var(--color-mint)" }}>{placeCnt}개</b>
      </Box>
      <Select
        options={selectOptionArr}
        defaultValue={selectOption}
        size="xs"
        setValue={setSelectOption}
        isBorder={false}
      />
    </Flex>
  );
}

export default StudyPageDrawerFilterBar;
