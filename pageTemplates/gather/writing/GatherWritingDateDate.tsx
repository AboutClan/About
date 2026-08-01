import { Box, Button, Flex, IconButton } from "@chakra-ui/react";
import { ko } from "date-fns/locale";
import dayjs from "dayjs";
import { forwardRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import styled from "styled-components";

import {
  PICKER_DATE_AND_TIME,
  PickerDateAndTimeHeader,
} from "../../../components/molecules/picker/DatePickerOptions";
import { DispatchType } from "../../../types/hooks/reactTypes";
import { IGatherWriting } from "../../../types/models/gatherTypes/gatherTypes";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

const TIME_RANGE_MIN = new Date();
TIME_RANGE_MIN.setHours(9);
TIME_RANGE_MIN.setMinutes(0);

const TIME_RAGNE_MAX = new Date();
TIME_RAGNE_MAX.setHours(23);
TIME_RAGNE_MAX.setMinutes(0);

interface IGatherWritingDateDate {
  date: Date;
  setDate: DispatchType<Date>;
  gatherWriting: Partial<IGatherWriting>;
  isOpenGather?: boolean;
  extraDates?: Date[];
  setExtraDates?: DispatchType<Date[]>;
}

function GatherWritingDateDate({
  date,
  setDate,
  gatherWriting,
  isOpenGather,
  extraDates,
  setExtraDates,
}: IGatherWritingDateDate) {
  /* eslint-disable react/display-name */
  //props를 직접 전달하지 않아서 그런지 optional로 안하면 타입 오류가 남
  type CustomInputProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: any;
    onClick?: () => void;
  };

  const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(({ value, onClick }, ref) => {
    const isDefault = value === dayjsToFormat(dayjs().hour(14).minute(0), "M월 D일 HH:mm");
    return (
      <Button
        size="lg"
        colorScheme="black"
        onClick={onClick}
        ref={ref}
        _focus={{ outline: "none" }}
      >
        {!isDefault ? value : "눌러서 날짜/시간 선택"}
      </Button>
    );
  });

  //초기 날짜 설정
  useEffect(() => {
    let currentDate = new Date();
    if (!gatherWriting?.date) {
      currentDate.setHours(14);
      currentDate.setMinutes(0);
    } else currentDate = dayjs(gatherWriting?.date).toDate();
    setDate(currentDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatherWriting]);

  return (
    <Layout>
      <Container>
        <Box mx="auto">
          <StyledDatePicker
            {...PICKER_DATE_AND_TIME}
            customInput={<CustomInput />}
            locale={ko}
            onChange={(date) => {
              const convertedDate = dayjs(date);
              setDate(convertedDate.toDate());
            }}
            selected={date}
            minTime={TIME_RANGE_MIN}
            maxTime={TIME_RAGNE_MAX}
            renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
              <PickerDateAndTimeHeader
                date={date}
                decreaseMonth={decreaseMonth}
                increaseMonth={increaseMonth}
              />
            )}
          />
        </Box>
      </Container>
      {isOpenGather && (
        <Box mt={4}>
          <Box fontSize="13px" fontWeight="semibold" mb={2}>
            추가 날짜 후보 (복수 선택 가능)
          </Box>
          {extraDates?.map((extraDate, idx) => (
            <Flex key={idx} align="center" justify="center" mb={2}>
              <StyledDatePicker
                {...PICKER_DATE_AND_TIME}
                customInput={<CustomInput />}
                locale={ko}
                onChange={(changed) => {
                  const convertedDate = dayjs(changed).toDate();
                  setExtraDates(extraDates.map((d, i) => (i === idx ? convertedDate : d)));
                }}
                selected={extraDate}
                minTime={TIME_RANGE_MIN}
                maxTime={TIME_RAGNE_MAX}
                renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                  <PickerDateAndTimeHeader
                    date={date}
                    decreaseMonth={decreaseMonth}
                    increaseMonth={increaseMonth}
                  />
                )}
              />
              <IconButton
                aria-label="후보 날짜 삭제"
                icon={<Box>✕</Box>}
                ml={2}
                size="sm"
                variant="ghost"
                onClick={() => setExtraDates(extraDates.filter((_, i) => i !== idx))}
              />
            </Flex>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const base = extraDates?.length
                ? extraDates[extraDates.length - 1]
                : date || new Date();
              setExtraDates([...(extraDates || []), dayjs(base).add(1, "day").toDate()]);
            }}
          >
            + 후보 날짜 추가
          </Button>
        </Box>
      )}
    </Layout>
  );
}

const Layout = styled.div`
  margin-top: var(--gap-5);
`;

const Container = styled.div`
  margin-top: var(--gap-5);
  display: flex;
  align-items: center;
  justify-items: center;

  background-color: inherit;

  .react-datepicker__header {
    font-size: 14px;
  }
  .react-datepicker__day-name {
    font-weight: 400;
    font-size: 12px;
    margin: 0px 4.2px;
  }
  .react-datepicker__day {
    font-weight: 400;
    width: 30px;
    height: 30px;
    padding-top: 4px;
  }
  .react-datepicker__day--selected {
    background-color: var(--color-mint);
  }
  .react-datepicker__time-list-item {
    font-size: 14px;
  }
  .react-datepicker__time-list-item--selected {
    background-color: var(--color-mint) !important;
  }
  .react-datepicker__triangle {
    left: -35% !important;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  background-color: inherit;
  padding: var(--gap-3) 0;

  margin-left: var(--gap-2);
`;

export default GatherWritingDateDate;
