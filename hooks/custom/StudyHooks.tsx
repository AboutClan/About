import dayjs, { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { setStudyWeekData } from "../../libs/study/studyConverters";

import { findMyStudyByUserId } from "../../libs/study/studySelectors";
import { StudyMergeResultProps, StudySetProps } from "../../types/models/studyTypes/derivedTypes";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import {
  useRealTimeCancelMutation,
  useRealTimeStatusMutation,
  useRealTimeTimeChangeMutation,
  useRealtimeVoteMutation,
} from "../realtime/mutations";
import {
  useStudyAbsenceMutation,
  useStudyParticipateMutation,
  useStudyResultTimeChangeMutation,
  useStudyVoteMutation,
} from "../study/mutations";
import { useStudyVoteQuery, useStudyWeekQuery } from "../study/queries";
import { useResetStudyQuery } from "./CustomHooks";
import { useTypeToast } from "./CustomToast";

export const useStudySetQuery = (date: string, isEnabled: boolean): { studySet: StudySetProps } => {
  const { data } = useStudyWeekQuery({ enabled: isEnabled });

  const studySet = useMemo(() => {
    if (!isEnabled || !data) return null;
    const dateStart = dayjs(date).startOf("day");
    const filtered = data.filter((d) => !dayjs(d.date).startOf("day").isBefore(dateStart));
    return setStudyWeekData(filtered) ?? null; // 참조 안정화
  }, [isEnabled, date, data]);

  return { studySet }; // 동일 참조 유지
};

export const useMyStudyResult = (date: string): StudyMergeResultProps => {
  const { data: session } = useSession();
  const { data: studyVoteData } = useStudyVoteQuery(date, { enabled: !!date });
  const findMyStudyResult = findMyStudyByUserId(studyVoteData, session?.user.id);
  return findMyStudyResult;
};

export const useStudyMutations = (date: Dayjs) => {
  const typeToast = useTypeToast();
  const resetStudy = useResetStudyQuery();

  const { mutate: vote } = useStudyVoteMutation(date, "post", {
    onSuccess: () => {
      typeToast("apply");
      resetStudy();
    },
  });

  const { mutate: change } = useStudyResultTimeChangeMutation(date, {
    onSuccess: () => {
      typeToast("change");
      resetStudy();
    },
  });

  const { mutate: cancel } = useStudyVoteMutation(date, "delete", {
    onSuccess: () => {
      typeToast("cancel");
      resetStudy();
    },
  });

  const { mutate: participate } = useStudyParticipateMutation(date, {
    onSuccess: () => {
      typeToast("participate");
      resetStudy();
    },
  });

  const { mutate: absence } = useStudyAbsenceMutation(date, {
    onSuccess: () => {
      typeToast("cancel");
      resetStudy();
    },
  });

  const { mutate: realTimeVote } = useRealtimeVoteMutation(dayjsToStr(date), {
    onSuccess: () => {
      typeToast("participate");
      resetStudy();
    },
  });

  const { mutate: realTimeChange } = useRealTimeTimeChangeMutation(dayjsToStr(date), {
    onSuccess: () => {
      typeToast("change");
      resetStudy();
    },
  });

  const { mutate: realTimeChangeStatus } = useRealTimeStatusMutation(dayjsToStr(date), {
    onSuccess: () => {
      typeToast("cancel");
      resetStudy();
    },
  });
  const { mutate: realTimeCancel } = useRealTimeCancelMutation(dayjsToStr(date), {
    onSuccess: () => {
      typeToast("cancel");
      resetStudy();
    },
  });

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
    },
  };
};
