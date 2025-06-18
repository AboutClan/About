import { Box, Flex } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";

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
        toast("info", "달력 준비중");
        return;
      }
      changeMonth((old) => old.subtract(1, "month"));
    } else {
      if (monthNum === dayjs().month()) {
        toast("info", "달력 준비중");
        return;
      }
      changeMonth((old) => old.add(1, "month"));
    }
  };

  return (
    <Flex align="center" fontSize="20px" fontWeight={800}>
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
