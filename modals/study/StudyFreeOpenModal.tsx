import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useState } from "react";

import TimeSelector from "../../components/molecules/picker/TimeSelector";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useCompleteToast, useErrorToast, useFailToast } from "../../hooks/custom/CustomToast";
import {
  useStudyOpenFreeMutation,
  useStudyParticipationMutation,
} from "../../hooks/study/mutations";
import { IModal } from "../../types/components/modalTypes";
import { ITimeStartToEnd } from "../../types/utils/timeAndDate";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IStudyFreeOpenModal extends IModal {}

function StudyFreeOpenModal({ setIsModal }: IStudyFreeOpenModal) {
  const { id, date } = useParams<{ id: string; date: string }>() || {};
  const resetStudy = useResetStudyQuery();
  const completeToast = useCompleteToast();
  const failToast = useFailToast();
  const errorToast = useErrorToast();

  const placeId = id;

  const [time, setTime] = useState<ITimeStartToEnd>({
    start: { hours: 14, minutes: 0 },
    end: { hours: 18, minutes: 0 },
  });

  const { mutateAsync: openFree, isLoading } = useStudyOpenFreeMutation(date, {
    onSuccess() {
      resetStudy();
      completeToast("free", "스터디가 Free로 오픈되었습니다.");
      setIsModal(false);
    },
    onError: errorToast,
  });
  const { mutate: patchAttend, isLoading: isLoading2 } = useStudyParticipationMutation(
    dayjs(date),
    "post",
    {
      onSuccess: () => {
        resetStudy();
      },
      onError: errorToast,
    },
  );

  const onSubmit = async () => {
    const start = dayjs(date).hour(time.start.hours).minute(time.start.minutes);
    const end = dayjs(date).hour(time.end.hours).minute(time.end.minutes);
    if (start > end) {
      failToast("time");
      return;
    }
    const data = {
      place: placeId,
      start,
      end,
    };

    await openFree(placeId as string);
    setTimeout(() => {
      patchAttend(data);
    }, 500);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "오픈",
      func: onSubmit,
      isLoading: isLoading || isLoading2,
    },
  };

  return (
    <ModalLayout title="스터디 FREE 오픈" footerOptions={footerOptions} setIsModal={setIsModal}>
      <TimeSelector
        setTimes={({ start, end }: ITimeStartToEnd) => {
          if (start) setTime({ end: time.end, start });
          if (end) setTime({ start: time.start, end });
        }}
        times={time}
      />
    </ModalLayout>
  );
}

export default StudyFreeOpenModal;
