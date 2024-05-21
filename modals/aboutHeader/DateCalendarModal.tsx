import { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Calendar from "../../components/molecules/Calendar";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useStudyDailyVoteCntQuery } from "../../hooks/study/queries";
import { handleChangeDate } from "../../pageTemplates/home/studyController/StudyController";
import { getStudyVoteButtonProps } from "../../pageTemplates/home/studyController/StudyControllerVoteButton";
import { myStudyState, studyDateStatusState } from "../../recoils/studyRecoils";
import { IModal } from "../../types/components/modalTypes";
import { ActiveLocation } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
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

  const onClick = (month: number) => {
    const newDate = handleChangeDate(selectedDate, "month", month);
    newSearchParams.set("date", newDate);
    router.replace(`/home?${newSearchParams.toString()}`, { scroll: false });
  };

  const handleSliderChange = (swiper) => {
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    if (swiper.activeIndex < swiper.previousIndex) setDate((old) => old.subtract(1, "month"));
    if (swiper.activeIndex > swiper.previousIndex) setDate((old) => old.add(1, "month"));
  };

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
        initialSlide={1}
        onSlideChange={handleSliderChange}
      >
        <SwiperSlide>
          <Calendar
            selectedDate={selectedDate.subtract(1, "month")}
            voteCntArr={voteCntArr}
            func={onClick}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Calendar selectedDate={selectedDate} voteCntArr={voteCntArr} func={onClick} />
        </SwiperSlide>
        <SwiperSlide>
          <Calendar
            selectedDate={selectedDate.add(1, "month")}
            voteCntArr={voteCntArr}
            func={onClick}
          />
        </SwiperSlide>
      </Swiper>
    </ModalLayout>
  );
}

export default DateCalendarModal;
