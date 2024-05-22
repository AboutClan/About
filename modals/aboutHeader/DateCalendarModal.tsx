import "swiper/css";

import dayjs, { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { Swiper, SwiperSlide } from "swiper/react";

import Calendar from "../../components/molecules/MonthCalendar";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useStudyDailyVoteCntQuery } from "../../hooks/study/queries";
import { getStudyVoteButtonProps } from "../../pageTemplates/home/studyController/StudyControllerVoteButton";
import { myStudyState, studyDateStatusState } from "../../recoils/studyRecoils";
import { IModal } from "../../types/components/modalTypes";
import { ActiveLocation } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
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

  const studyDateStatus = useRecoilValue(studyDateStatusState);
  const myStudy = useRecoilValue(myStudyState);
  const buttonProps = getStudyVoteButtonProps(studyDateStatus, myStudy, session?.user.uid);

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
    console.log(dateStr);
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

  const footerOptions: IFooterOptions = {
    main: {
      text: "참여 신청",
    },
    sub: {
      text: "날짜 이동",
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
