import { Dayjs } from "dayjs";

import { dayjsToStr } from "../../utils/dateTimeUtils";
import {
  useRealTimeAbsenceMutation,
  useRealTimeCancelMutation,
  useRealTimeTimeChangeMutation,
  useRealtimeVoteMutation,
} from "../realtime/mutations";
import {
  useStudyAbsenceMutation,
  useStudyParticipateMutation,
  useStudyResultTimeChangeMutation,
  useStudyVoteMutation,
} from "../study/mutations";
import { useResetStudyQuery } from "./CustomHooks";
import { useTypeToast } from "./CustomToast";

// export const useStudySetQuery = (date: string, isEnabled: boolean): { studySet: StudySetProps } => {
//   const { data } = useStudyWeekQuery({ enabled: isEnabled });

//   const studySet = useMemo(() => {
//     if (!isEnabled || !data) return null;
//     const dateStart = dayjs(date).startOf("day");
//     const filtered = data.filter((d) => !dayjs(d.date).startOf("day").isBefore(dateStart));
//     return setStudyWeekData(filtered) ?? null; // 참조 안정화
//   }, [isEnabled, date, data]);

// //   return { studySet }; // 동일 참조 유지
// // };

// export const useMyStudyResult = (date: string): StudyMergeResultProps => {
//   const { data: session } = useSession();
//   const { data: studyVoteData } = useStudyPassedDayQuery(date, { enabled: !!date });
//   const findMyStudyResult = findMyStudyByUserId(studyVoteData, session?.user.id);
//   return findMyStudyResult;
// };

export const useStudyMutations = (date: Dayjs) => {
  const typeToast = useTypeToast();
  const resetStudy = useResetStudyQuery();

  const { mutate: vote, isLoading: isLoading1 } = useStudyVoteMutation(date, "post", {
    onSuccess: () => {
      typeToast("apply");
      resetStudy();
    },
  });

  const { mutate: change, isLoading: isLoading2 } = useStudyResultTimeChangeMutation(date, {
    onSuccess: () => {
      typeToast("change");
      resetStudy();
    },
  });

  const { mutate: cancel, isLoading: isLoading3 } = useStudyVoteMutation(date, "delete", {
    onSuccess: () => {
      typeToast("cancel");
      resetStudy();
    },
  });

  const { mutate: participate, isLoading: isLoading4 } = useStudyParticipateMutation(date, {
    onSuccess: () => {
      typeToast("participate");
      resetStudy();
    },
  });

  const { mutate: absence, isLoading: isLoading5 } = useStudyAbsenceMutation(dayjsToStr(date), {
    onSuccess: () => {
      typeToast("cancel");
      resetStudy();
    },
  });

  const { mutate: realTimeVote, isLoading: isLoading6 } = useRealtimeVoteMutation(
    dayjsToStr(date),
    {
      onSuccess: () => {
        typeToast("participate");
        resetStudy();
      },
    },
  );

  const { mutate: realTimeChange, isLoading: isLoading7 } = useRealTimeTimeChangeMutation(
    dayjsToStr(date),
    {
      onSuccess: () => {
        typeToast("change");
        resetStudy();
      },
    },
  );
  const { mutate: realTimeAbsence, isLoading: isLoading9 } = useRealTimeAbsenceMutation(
    dayjsToStr(date),
    {
      onSuccess: () => {
        typeToast("cancel");
        resetStudy();
      },
    },
  );

  // const { mutate: realTimeChangeStatus } = useRealTimeStatusMutation(dayjsToStr(date), {
  //   onSuccess: () => {
  //     typeToast("cancel");
  //     resetStudy();
  //   },
  // });
  const { mutate: realTimeCancel, isLoading: isLoading8 } = useRealTimeCancelMutation(
    dayjsToStr(date),
    {
      onSuccess: () => {
        typeToast("cancel");

        resetStudy();
      },
    },
  );

  return {
    voteStudy: {
      participate,
      vote,
      change,
      cancel,
      absence,
    },
    realTimeStudy: {
      vote: realTimeVote,
      change: realTimeChange,
      cancel: realTimeCancel,
      absence: realTimeAbsence,
    },
    isLoading:
      isLoading1 ||
      isLoading2 ||
      isLoading3 ||
      isLoading4 ||
      isLoading5 ||
      isLoading6 ||
      isLoading7 ||
      isLoading8 ||
      isLoading9,
  };
};
