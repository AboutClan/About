import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import Select from "../../../components/atoms/Select";

interface StudyPageDrawerFilterBarProps {
  placeCnt: number;
}

type SelectOption = "인원순" | "거리순" | "즐겨찾기순";

function StudyPageDrawerFilterBar({ placeCnt }: StudyPageDrawerFilterBarProps) {
  const [selectOption, setSelectOption] = useState<SelectOption>("거리순");

  const selectOptionArr = ["인원순", "거리순", "즐겨찾기순"];

  return (
    <Flex justify="space-between">
      <Box fontSize="12px">
        전체 <b style={{ color: "var(--color-mint)" }}>{placeCnt}개</b>
      </Box>
      <Select
        options={selectOptionArr}
        defaultValue={selectOption}
        size="sm"
        setValue={setSelectOption}
        isBorder={false}
      />
    </Flex>
  );
}

export default StudyPageDrawerFilterBar;
