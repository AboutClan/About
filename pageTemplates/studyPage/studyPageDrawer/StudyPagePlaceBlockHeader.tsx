import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import SectionHeader from "../../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../../components/Icons/ArrowIcons";
import DateCalendarModal from "../../../modals/aboutHeader/DateCalendarModal";
import { DispatchString } from "../../../types/hooks/reactTypes";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

interface StudyPagePlaceSectionHeaderProps {
  date: string;
  setDate: DispatchString;
}

function StudyPagePlaceSectionHeader({ date, setDate }: StudyPagePlaceSectionHeaderProps) {
  const [isCalendarModal, setIsCalendarModal] = useState(false);
  const englishDayjs = dayjs(date).locale("en");

  return (
    <>
      <Box mb={4}>
        <SectionHeader
          title={dayjsToFormat(dayjs(date), "YYYY년 M월 D일")}
          subTitle={dayjsToFormat(englishDayjs, "MMMM")}
        >
          <Flex flex={1} ml={1.5} justify="space-between" align="center">
            <Button
              display="flex"
              justifyItems="center"
              variant="unstyled"
              w="12px"
              height="12px"
              color="var(--color-mint)"
              onClick={() => setIsCalendarModal(true)}
            >
              <ShortArrowIcon dir="bottom" />
            </Button>
          </Flex>
        </SectionHeader>
      </Box>
      {isCalendarModal && (
        <DateCalendarModal date={date} setDate={setDate} setIsModal={setIsCalendarModal} />
      )}
    </>
  );
}

export default StudyPagePlaceSectionHeader;
