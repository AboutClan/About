import { Flex } from "@chakra-ui/react";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function StudyControllerDays() {
  return (
    <Flex justify="space-between" h="42px" align="center" color="var(--gray-500)" fontWeight={500}>
      {DAYS.map((day, idx) => (
        <Flex justify="center" align="center" w="30px" h="30px" key={idx}>
          {day}
        </Flex>
      ))}
    </Flex>
  );
}

export default StudyControllerDays;
