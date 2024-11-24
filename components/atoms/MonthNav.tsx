import { Box, Flex } from "@chakra-ui/react";
import { Dayjs } from "dayjs";

import { useToast } from "../../hooks/custom/CustomToast";
import { DispatchType } from "../../types/hooks/reactTypes";

interface MonthNavProps {
  monthNum: number;
  changeMonth: DispatchType<Dayjs>;
}

function MonthNav({ monthNum, changeMonth }: MonthNavProps) {
  const toast = useToast();
  const handleMonthChange = (dir: "left" | "right") => {
    if (dir === "left") {
      if (monthNum === 10) {
        toast("info", "달력이 존재하지 않습니다.");
        return;
      }
      changeMonth((old) => old.subtract(1, "month"));
    } else changeMonth((old) => old.add(1, "month"));
  };

  return (
    <Flex align="center" fontSize="18px" fontWeight={800}>
      <Box as="button" px={2} onClick={() => handleMonthChange("left")}>
        <i className="fa-solid fa-caret-left fa-xs" />
      </Box>
      <span>{monthNum + 1}월</span>
      <Box as="button" px={2} onClick={() => handleMonthChange("right")}>
        <i className="fa-solid fa-caret-right fa-xs" />
      </Box>
    </Flex>
  );
}

export default MonthNav;
