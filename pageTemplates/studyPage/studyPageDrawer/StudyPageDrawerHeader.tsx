import { Box, Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";
import SectionHeader from "../../../components/atoms/SectionHeader";
import { BottomShortArrowIcon } from "../../../components/Icons/ArrowIcons";
import DateCalendarModal from "../../../modals/aboutHeader/DateCalendarModal";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

interface StudyPageDrawerHeaderProps {
  date: string;
}

function StudyPageDrawerHeader({ date }: StudyPageDrawerHeaderProps) {
  const [isCalendarModal, setIsCalendarModal] = useState(false);

  const englishDayjs = dayjs(date).locale("en");

  return (
    <>
      <Box mb={4}>
        <SectionHeader
          title={dayjsToFormat(dayjs(date), "YYYY년 M월 D일")}
          subTitle={dayjsToFormat(englishDayjs, "MMMM")}
        >
          <Box flex={1} ml={1}>
            <Button
              display="flex"
              justifyItems="center"
              variant="unstyled"
              w="12px"
              height="12px"
              color="var(--color-mint)"
              onClick={() => setIsCalendarModal(true)}
            >
              <BottomShortArrowIcon />
            </Button>
          </Box>
        </SectionHeader>
      </Box>
      {isCalendarModal && <DateCalendarModal date={date} setIsModal={setIsCalendarModal} />}
    </>
  );
}

export default StudyPageDrawerHeader;
