import { Box, Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import SectionHeader from "../../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../../components/Icons/ArrowIcons";
import DateCalendarModal from "../../../modals/aboutHeader/DateCalendarModal";
import { DispatchString } from "../../../types/hooks/reactTypes";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

interface StudyPageDrawerHeaderProps {
  date: string;
  setDate: DispatchString;
  isDrawerUp: boolean;
}

function StudyPageDrawerHeader({ date, setDate, isDrawerUp }: StudyPageDrawerHeaderProps) {
  const [isCalendarModal, setIsCalendarModal] = useState(false);

  const englishDayjs = dayjs(date).locale("en");

  return (
    <>
      <Box mb={4}>
        <SectionHeader
          title={dayjsToFormat(dayjs(date), "YYYY년 M월 D일")}
          subTitle={dayjsToFormat(englishDayjs, "MMMM")}
        >
          <Box flex={1} ml={1.5}>
            <Button
              display="flex"
              justifyItems="center"
              variant="unstyled"
              w="12px"
              height="12px"
              color="var(--color-mint)"
              onClick={() => setIsCalendarModal(true)}
            >
              <ShortArrowIcon dir={isDrawerUp ? "bottom" : "top"} />
            </Button>
          </Box>
        </SectionHeader>
      </Box>
      {isCalendarModal && (
        <DateCalendarModal date={date} setDate={setDate} setIsModal={setIsCalendarModal} />
      )}
    </>
  );
}

export default StudyPageDrawerHeader;
