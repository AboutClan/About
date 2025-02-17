import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import LocationSelector from "../../../components/atoms/LocationSelector";
import SectionHeader from "../../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../../components/Icons/ArrowIcons";
import { LOCATION_ALL } from "../../../constants/location";
import DateCalendarModal from "../../../modals/aboutHeader/DateCalendarModal";
import { DispatchString, DispatchType } from "../../../types/hooks/reactTypes";
import { Location } from "../../../types/services/locationTypes";
import { dayjsToFormat, dayjsToStr } from "../../../utils/dateTimeUtils";

interface StudyPageDrawerHeaderProps {
  date: string;
  setDate: DispatchString;
  location: Location;
  setLocation: DispatchType<Location>;
}

function StudyPageDrawerHeader({
  date,
  setDate,
  location,
  setLocation,
}: StudyPageDrawerHeaderProps) {
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
  console.log(navigateNextDay);
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

            <LocationSelector
              options={LOCATION_ALL}
              defaultValue={location}
              setValue={setLocation}
            />
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
