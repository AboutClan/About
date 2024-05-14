import { Dayjs } from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import Calendar from "../../components/molecules/Calendar";
import { handleChangeDate } from "../../pageTemplates/home/studyController/StudyController";

import { IModal } from "../../types/components/modalTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { IFooterOptions, IHeaderOptions, ModalLayout } from "../Modals";
interface DateCalendarModalProps extends IModal {
  selectedDate: Dayjs;
}

function DateCalendarModal({ selectedDate, setIsModal }: DateCalendarModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const headerOptions: IHeaderOptions = {};

  const footerOptions: IFooterOptions = {
    children: <></>,
  };

  const onClick = (month: number) => {
    const newDate = handleChangeDate(selectedDate, "month", month);
    newSearchParams.set("date", newDate);
    router.replace(`/home?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <ModalLayout
      title={dayjsToFormat(selectedDate, "YYYY년 M월")}
      setIsModal={setIsModal}
      footerOptions={footerOptions}
    >
      <Calendar selectedDate={selectedDate} type="month" func={onClick} />
    </ModalLayout>
  );
}

export default DateCalendarModal;
