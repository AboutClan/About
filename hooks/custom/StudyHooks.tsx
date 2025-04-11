import { useSession } from "next-auth/react";
import { findMyStudyByUserId } from "../../libs/study/studySelectors";
import { StudyMergeResultProps } from "../../types/models/studyTypes/derivedTypes";

import { useStudyVoteQuery } from "../study/queries";

export const useMyStudyResult = (date: string): StudyMergeResultProps => {
  const { data: session } = useSession();
  const { data: studyVoteData } = useStudyVoteQuery(date, { enabled: !!date });
  const findMyStudyResult = findMyStudyByUserId(studyVoteData, session?.user.id);
  return findMyStudyResult;
};
