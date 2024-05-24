import "swiper/css";

import dayjs, { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { Swiper, SwiperSlide } from "swiper/react";

import Calendar from "../../components/molecules/MonthCalendar";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useStudyDailyVoteCntQuery } from "../../hooks/study/queries";
import { handleChangeDate } from "../../pageTemplates/home/studyController/StudyController";
import { studyDateStatusState } from "../../recoils/studyRecoils";
import { IModal } from "../../types/components/modalTypes";
import { ActiveLocation } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToFormat, dayjsToStr } from "../../utils/dateTimeUtils";
import { IFooterOptions, IPaddingOptions, ModalLayout } from "../Modals";

interface DateCalendarModalProps extends IModal {
  selectedDate: Dayjs;
}

function DateCalendarModal({ selectedDate, setIsModal }: DateCalendarModalProps) {
  const typeToast = useTypeToast();
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const isGuest = session?.user.name === "guest";
  const location = searchParams.get("location");

  const setStudyDateStatus = useSetRecoilState(studyDateStatusState);

  const [date, setDate] = useState(selectedDate);
  const [calendarArr, setCalendarArr] = useState([
    date.subtract(3, "month"),
    date.subtract(2, "month"),
    date.subtract(1, "month"),
    date,
    date.add(1, "month"),
    date.add(2, "month"),
    date.add(3, "month"),
  ]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [pageIdx, setPageIdx] = useState(3);

  const { data: voteCntArr } = useStudyDailyVoteCntQuery(
    convertLocationLangTo(location as ActiveLocation, "kr"),
    calendarArr[pageIdx].startOf("month"),
    calendarArr[pageIdx].endOf("month"),
    {
      enabled: !!location,
    },
  );

  const onClick = (dateStr: string) => {
    setDate(dayjs(dateStr));
  };

  const handleSliderChange = (swiper) => {
    setPageIdx(swiper.realIndex);
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }

    if (swiper.activeIndex < swiper.previousIndex) {
      if (!calendarArr.map((day) => day.month()).includes(date.subtract(2, "month").month())) {
        setCalendarArr((old) => [date.subtract(2, "month"), ...old]);
      }
    }
    if (swiper.activeIndex > swiper.previousIndex) {
      if (!calendarArr.map((day) => day.month()).includes(date.add(2, "month").month())) {
        setCalendarArr((old) => [...old, date.add(2, "month")]);
      }
    }
  };

  const moveDate = () => {
    if (dayjsToStr(selectedDate) === dayjsToStr(date)) {
      setIsModal(false);
      return;
    }
    setStudyDateStatus(undefined);
    const newDate = handleChangeDate(date, "date", date.date());

    newSearchParams.set("date", newDate);
    router.replace(`/home?${newSearchParams.toString()}`, { scroll: false });
    setIsModal(false);
  };

  const voteStudy = () => {
    if (isGuest) {
      typeToast("guest");
      return;
    }
    const newDate = handleChangeDate(date, "date", date.date());
    newSearchParams.set("date", newDate);
    router.push(`/vote?${newSearchParams.toString()}`);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "참여 신청",
      func: voteStudy,
    },
    sub: {
      text: "날짜 이동",
      func: moveDate,
    },
  };

  const paddingOptions: IPaddingOptions = {
    footer: 0,
  };

  return (
    <ModalLayout
      footerOptions={footerOptions}
      paddingOptions={paddingOptions}
      title={dayjsToFormat(calendarArr[pageIdx], "YYYY년 M월")}
      setIsModal={setIsModal}
    >
      <Swiper
        style={{
          width: "100%",
          height: "auto",
        }}
        slidesPerView={1}
        spaceBetween="40px"
        initialSlide={pageIdx}
        onSlideChange={handleSliderChange}
      >
        {calendarArr.map((cal, idx) => (
          <SwiperSlide key={idx}>
            <Calendar
              standardDate={cal}
              selectedDate={date}
              voteCntArr={voteCntArr}
              func={onClick}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </ModalLayout>
  );
}

export default DateCalendarModal;
