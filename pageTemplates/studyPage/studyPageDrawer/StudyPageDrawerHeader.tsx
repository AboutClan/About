import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import ButtonWrapper from "../../../components/atoms/ButtonWrapper";
import SectionHeader from "../../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../../components/Icons/ArrowIcons";
import DateCalendarModal from "../../../modals/aboutHeader/DateCalendarModal";
import { DispatchString } from "../../../types/hooks/reactTypes";
import { dayjsToFormat, dayjsToStr } from "../../../utils/dateTimeUtils";

interface StudyPageDrawerHeaderProps {
  date: string;
  setDate: DispatchString;
  isDrawerUp: boolean;
}

function StudyPageDrawerHeader({ date, setDate, isDrawerUp }: StudyPageDrawerHeaderProps) {
  const [isCalendarModal, setIsCalendarModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const englishDayjs = dayjs(date).locale("en");

  const navigateNextDay = () => {
    const newDate = dayjsToStr(dayjs(date).add(1, "day"));
    setDate(newDate);
    newSearchParams.set("date", newDate);
    router.replace(`/studyPage?${newSearchParams.toString()}`);
  };

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
              <ShortArrowIcon dir={isDrawerUp ? "bottom" : "top"} />
            </Button>
            <ButtonWrapper
              onClick={navigateNextDay}
              text={dayjsToFormat(dayjs(date).add(1, "day"), "M월 D일")}
              size="xs"
            >
              <ShortArrowIcon dir="right" />
            </ButtonWrapper>
          </Flex>
        </SectionHeader>
      </Box>
      {isCalendarModal && (
        <DateCalendarModal date={date} setDate={setDate} setIsModal={setIsCalendarModal} />
      )}
    </>
  );
}

export default StudyPageDrawerHeader;
