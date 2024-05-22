import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import dayjs, { Dayjs } from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Calendar from "../../components/molecules/Calendar";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useStudyDailyVoteCntQuery } from "../../hooks/study/queries";
import { getStudyVoteButtonProps } from "../../pageTemplates/home/studyController/StudyControllerVoteButton";
import { myStudyState, studyDateStatusState } from "../../recoils/studyRecoils";
import { IModal } from "../../types/components/modalTypes";
import { ActiveLocation } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToFormat, dayjsToStr } from "../../utils/dateTimeUtils";
import { ModalLayout } from "../Modals";

SwiperCore.use([Navigation, Pagination]);
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
    date.subtract(4, "month"),
    date.subtract(3, "month"),
    date.subtract(2, "month"),
    date.subtract(1, "month"),
    date,
    date.add(1, "month"),
    date.add(2, "month"),
    date.add(3, "month"),
  ]);
  const [initialLoad, setInitialLoad] = useState(true);
  console.log(444, date);
  const { data: voteCntArr } = useStudyDailyVoteCntQuery(
    convertLocationLangTo(location as ActiveLocation, "kr"),
    date.startOf("month"),
    date.endOf("month"),
    {
      enabled: !!location,
    },
  );

  const onClick = (dateStr: string) => {
    setDate(dayjs(dateStr));
    // const newDate = handleChangeDate(selectedDate, "month", month);
    // newSearchParams.set("date", newDate);
  };

  const handleSliderChange = (swiper) => {
    console.log(2, swiper);
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    if (swiper.activeIndex < swiper.previousIndex) {
      setDate((old) => old.subtract(1, "month"));
      if (
        !calendarArr.map((day) => dayjsToStr(day)).includes(dayjsToStr(date.subtract(2, "month")))
      ) {
        setCalendarArr((old) => [date.subtract(2, "month"), ...old]);
      }
    }
    if (swiper.activeIndex > swiper.previousIndex) {
      setDate((old) => old.add(1, "month"));
      if (!calendarArr.map((day) => dayjsToStr(day)).includes(dayjsToStr(date.add(1, "month")))) {
        setCalendarArr((old) => [...old, date.add(1, "month")]);
      }
    }
  };
  console.log(43, calendarArr);
  return (
    <ModalLayout title={dayjsToFormat(date, "YYYY년 M월")} setIsModal={setIsModal}>
      <Swiper
        navigation
        style={{
          width: "100%",
          height: "auto",
        }}
        slidesPerView={1}
        spaceBetween="40px"
        initialSlide={3}
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
