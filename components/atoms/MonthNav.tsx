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
      if (monthNum === dayjs().month() - 1) {
        toast("info", "달력 준비중");
        return;
      }
      changeMonth((old) => old.add(1, "month"));
    }
  };

  return (
    <Flex align="center" fontSize="20px" fontWeight={800} alignItems="center">
      <Box as="button" px={1} onClick={() => handleMonthChange("left")}>
        <LeftArrowIcon />
      </Box>
      <Box lineHeight="28px">{monthNum + 1}월</Box>
      <Box as="button" px={1} onClick={() => handleMonthChange("right")}>
        <RightArrowIcon />
      </Box>
    </Flex>
  );
}

function LeftArrowIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="28px"
    viewBox="0 -960 960 960"
    width="28px"
    fill="var(--gray-900)"
  >
    <path d="M526-314 381-459q-5-5-7-10t-2-11q0-6 2-11t7-10l145-145q3-3 6.5-4.5t7.5-1.5q8 0 14 5.5t6 14.5v304q0 9-6 14.5t-14 5.5q-2 0-14-6Z" />
  </svg>
}

function RightArrowIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="28px"
    viewBox="0 -960 960 960"
    width="28px"
    fill="var(--gray-900)"
  >
    <path d="M420-308q-8 0-14-5.5t-6-14.5v-304q0-9 6-14.5t14-5.5q2 0 14 6l145 145q5 5 7 10t2 11q0 6-2 11t-7 10L434-314q-3 3-6.5 4.5T420-308Z" />
  </svg>
}

export default MonthNav;
