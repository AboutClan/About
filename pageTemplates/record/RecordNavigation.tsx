import { Button, Flex } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

import Slide from "../../components/layouts/PageSlide";

interface IRecordNavigation {
  isCalendar: boolean;
  setIsCalendar: Dispatch<SetStateAction<boolean>>;
}

function RecordNavigation({ isCalendar, setIsCalendar }: IRecordNavigation) {
  return (
    <Slide isFixed={true} posZero="top">
      <Flex p="16px" maxW="var(--max-width)" m="0 auto">
        <Button
          flex="1"
          colorScheme={isCalendar ? "mintTheme" : "gray"}
          onClick={() => setIsCalendar(true)}
        >
          달력
        </Button>
        <Button
          flex="1"
          colorScheme={!isCalendar ? "mintTheme" : "gray"}
          onClick={() => setIsCalendar(false)}
        >
          상세
        </Button>
      </Flex>
    </Slide>
  );
}

export default RecordNavigation;
