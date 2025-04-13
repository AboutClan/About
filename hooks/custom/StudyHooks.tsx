import { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";

import { findMyStudyByUserId } from "../../libs/study/studySelectors";
import { StudyMergeResultProps } from "../../types/models/studyTypes/derivedTypes";
import {
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
import { useStudyVoteQuery } from "../study/queries";
import { useResetStudyQuery } from "./CustomHooks";
import { useTypeToast } from "./CustomToast";

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

  const { mutate: realTimeVote } = useRealtimeVoteMutation({
    onSuccess: () => {
      typeToast("participate");
      resetStudy();
    },
  });

  const { mutate: realTimeChange } = useRealTimeTimeChangeMutation({
    onSuccess: () => {
      typeToast("change");
      resetStudy();
    },
  });

  const { mutate: realTimeChangeStatus } = useRealTimeStatusMutation({
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
      cancel: realTimeChangeStatus,
    },
  };
};
