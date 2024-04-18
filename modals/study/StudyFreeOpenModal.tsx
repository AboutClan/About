import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "react-query";

import TimeSelector from "../../components/molecules/picker/TimeSelector";
import { STUDY_VOTE } from "../../constants/keys/queryKeys";
import { useCompleteToast, useErrorToast, useFailToast } from "../../hooks/custom/CustomToast";
import {
  useStudyOpenFreeMutation,
  useStudyParticipationMutation,
} from "../../hooks/study/mutations";
import { PLACE_TO_LOCATION } from "../../storage/study";
import { IModal } from "../../types/components/modalTypes";
import { ITimeStartToEnd } from "../../types/utils/timeAndDate";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IStudyFreeOpenModal extends IModal {}

function StudyFreeOpenModal({ setIsModal }: IStudyFreeOpenModal) {
  const { id, date } = useParams<{ id: string; date: string }>() || {};

  const completeToast = useCompleteToast();
  const failToast = useFailToast();
  const errorToast = useErrorToast();

  const queryClient = useQueryClient();

  const placeId = id;

  const location = PLACE_TO_LOCATION[id];

  const [time, setTime] = useState<ITimeStartToEnd>({
    start: { hours: 14, minutes: 0 },
    end: { hours: 18, minutes: 0 },
  });

  const { mutateAsync: openFree, isLoading } = useStudyOpenFreeMutation(date, {
    onSuccess() {
      queryClient.invalidateQueries([STUDY_VOTE, date, location]);
      completeToast("free", "스터디가 Free로 오픈되었습니다.");
      setIsModal(false);
    },
    onError: errorToast,
  });
  const { mutate: patchAttend } = useStudyParticipationMutation(dayjs(date), "post", {
    onSuccess: () => {
      queryClient.invalidateQueries([STUDY_VOTE, date, location]);
    },
    onError: errorToast,
  });

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
      isLoading,
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
