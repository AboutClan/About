import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQueryClient } from "react-query";
import TimeSelector from "../../components/features/picker/TimeSelector";
import { IFooterOptions, ModalLayout } from "../../components/modals/Modals";
import { STUDY_VOTE } from "../../constants/keys/queryKeys";
import {
  useCompleteToast,
  useErrorToast,
  useFailToast,
} from "../../hooks/custom/CustomToast";
import {
  useStudyOpenFreeMutation,
  useStudyParticipationMutation,
} from "../../hooks/study/mutations";

import { IModal } from "../../types/reactTypes";
import { IPlace } from "../../types/study/studyDetail";
import { ITimeStartToEnd } from "../../types/timeAndDate";

interface IStudyFreeOpenModal extends IModal {
  place?: IPlace;
}

function StudyFreeOpenModal({ place, setIsModal }: IStudyFreeOpenModal) {
  const { data: session } = useSession();
  const { id, date } = useParams<{ id: string; date: string }>() || {};
  const router = useRouter();

  const completeToast = useCompleteToast();
  const failToast = useFailToast();
  const errorToast = useErrorToast();

  const queryClient = useQueryClient();

  const placeId = id;

  const location = session?.user.location;

  const [time, setTime] = useState<ITimeStartToEnd>({
    start: { hours: 14, minutes: 0 },
    end: { hours: 18, minutes: 0 },
  });

  const { mutateAsync: openFree } = useStudyOpenFreeMutation(date, {
    onSuccess() {
      completeToast("free", "스터디가 Free로 오픈되었습니다.");
    },
    onError: errorToast,
  });
  const { mutate: patchAttend } = useStudyParticipationMutation(
    dayjs(date),
    "post",
    {
      onSuccess: () => {
        queryClient.invalidateQueries([STUDY_VOTE, date, location]);
        setIsModal(false);
      },
      onError: errorToast,
    }
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
    },
  };

  return (
    <ModalLayout
      title="스터디 FREE 오픈"
      footerOptions={footerOptions}
      setIsModal={setIsModal}
    >
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
