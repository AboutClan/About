import "swiper/css";

import { Box, Flex, ModalHeader } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import IconButton from "../../components/atoms/buttons/IconButton";
import Calendar from "../../components/molecules/MonthCalendar";
import { handleChangeDate } from "../../pageTemplates/home/study/studyController/StudyController";
import { IModal } from "../../types/components/modalTypes";
import { DispatchString } from "../../types/hooks/reactTypes";
import { dayjsToFormat, dayjsToStr } from "../../utils/dateTimeUtils";
import { IFooterOptions, IPaddingOptions, ModalLayout } from "../Modals";

interface DateCalendarModalProps extends IModal {
  date: string; // YYYY-MM-DD
  setDate: DispatchString;
}

const INITIAL_SLIDE = 4; // 현재-4 ~ 현재+1 중 "현재" 위치

function DateCalendarModal({
  date: selectedDate,
  setDate: changeDate,
  setIsModal,
}: DateCalendarModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = useMemo(() => new URLSearchParams(searchParams), [searchParams]);

  // 표기 기준 월 & 실제 선택 날짜
  const [standardDate, setStandardDate] = useState(dayjs(selectedDate));
  const [date, setDate] = useState(dayjs(selectedDate));

  // 현재 기준 6개월(현재-4 ~ 현재+1)
  const monthArr = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) =>
        dayjsToStr(dayjs().clone().subtract(4, "month").add(i, "month")),
      ),
    [],
  );

  const [initialLoad, setInitialLoad] = useState(true);
  const [activeIdx, setActiveIdx] = useState(INITIAL_SLIDE);

  // Swiper 제어용 ref
  const swiperRef = useRef<SwiperType | null>(null);

  const onDayClick = useCallback((dateStr: string) => {
    setDate(dayjs(dateStr));
  }, []);

  const handleSliderChange = useCallback(
    (sw: SwiperType) => {
      if (initialLoad) {
        setInitialLoad(false);
        return;
      }
      const idx = sw.activeIndex;
      setActiveIdx(idx);
      setStandardDate(dayjs(monthArr[idx]));
    },
    [initialLoad, monthArr],
  );

  const moveDate = useCallback(() => {
    const picked = dayjsToStr(date);
    if (selectedDate === picked) {
      setIsModal(false);
      return;
    }
    const newDate = handleChangeDate(date, "date", date.date());
    changeDate(newDate);
    newSearchParams.set("date", newDate);
    router.replace(`/studyPage?${newSearchParams.toString()}`, { scroll: false });
    setIsModal(false);
  }, [changeDate, date, newSearchParams, router, selectedDate, setIsModal]);

  const goPrev = useCallback(() => swiperRef.current?.slidePrev(), []);
  const goNext = useCallback(() => swiperRef.current?.slideNext(), []);

  const footerOptions: IFooterOptions = { main: { text: "날짜 이동", func: moveDate } };
  const paddingOptions: IPaddingOptions = { footer: 0 };

  function Header() {
  return <ModalHeader
      fontWeight={700}
      px={6}
      pt={4}
      pb={3}
      fontSize="16px"
      color="var(--gray-800)"
      textAlign="center"
    >
      <CalendarHeader
        leftDisabled={activeIdx === 0}
        rightDisabled={activeIdx === monthArr.length - 1}
        goPrev={goPrev}
        goNext={goNext}
        date={dayjsToStr(standardDate)}
      />
    </ModalHeader>
}

  return (
    <ModalLayout
      headerOptions={{ children: <Header /> }}
      footerOptions={footerOptions}
      paddingOptions={paddingOptions}
      setIsModal={setIsModal}
      isCloseButton={false}
    >
      <Swiper
        style={{ width: "100%", height: "auto" }}
        slidesPerView={1}
        spaceBetween={40}
        initialSlide={INITIAL_SLIDE}
        onSwiper={(sw) => {
          swiperRef.current = sw;
          setActiveIdx(sw.activeIndex);
          setStandardDate(dayjs(monthArr[sw.activeIndex]));
        }}
        onSlideChange={handleSliderChange}
      >
        {monthArr.map((cal, idx) => (
          <SwiperSlide key={cal}>
            <Calendar
              standardDate={cal}
              selectedDates={[dayjsToStr(date)]}
              func={onDayClick}
              mintDateArr={[dayjsToStr(dayjs())]}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </ModalLayout>
  );
}

export function CalendarHeader({
  goPrev,
  goNext,
  leftDisabled,
  rightDisabled,
  date,
}: {
  goPrev: () => void;
  goNext: () => void;
  leftDisabled: boolean;
  rightDisabled: boolean;
  date: string;
}) {
  return (
    <Flex justify="space-between" align="center">
      <IconButton onClick={goPrev} isDisabled={leftDisabled} aria-label="이전 달">
        <LeftIcon />
      </IconButton>
      <Box pt="2px" fontWeight={500}>
        {dayjsToFormat(dayjs(date), "YYYY년 M월")}
      </Box>
      <IconButton onClick={goNext} isDisabled={rightDisabled} aria-label="다음 달">
        <RightIcon />
      </IconButton>
    </Flex>
  );
}

function LeftIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20"
    viewBox="0 -960 960 960"
    width="20"
    fill="var(--gray-500)"
  >
    <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
  </svg>
}

function RightIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20"
    viewBox="0 -960 960 960"
    width="20"
    fill="var(--gray-500)"
  >
    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
  </svg>
}

export default DateCalendarModal;
