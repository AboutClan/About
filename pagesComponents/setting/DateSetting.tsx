import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  STUDY_VOTE_START_HOUR,
  VOTER_DATE_END,
} from "../../constants/settingValue/study";
import { getInterestingDate, getStudyDate } from "../../helpers/studyHelpers";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { isMainLoadingState } from "../../recoil/loadingAtoms";
import {
  myStudyFixedState,
  participationsState,
  studyDateStatusState,
  voteDateState,
} from "../../recoil/studyAtoms";
import { locationState } from "../../recoil/userAtoms";

function DateSetting() {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";

  const [voteDate, setVoteDate] = useRecoilState(voteDateState);
  const location = useRecoilValue(locationState);
  const setStudyDateStatus = useSetRecoilState(studyDateStatusState);
  const setIsMainLoading = useSetRecoilState(isMainLoadingState);
  const setMyStudyFixed = useSetRecoilState(myStudyFixedState);
  const setParticipations = useSetRecoilState(participationsState);

  const [isDefaultPrev, setIsDefaultPrev] = useState(false);

  //스터디 참여자인지 판단
  useStudyVoteQuery(dayjs(), location, {
    enabled: isDefaultPrev && !isGuest && !!location,
    onSuccess(data) {
      if (voteDate) return;
      const isMyVote = data.participations.some(
        (participation) =>
          participation.status === "open" &&
          participation.attendences.some(
            (who) => who.firstChoice && who.user.uid === session.uid
          )
      );
      if (isMyVote) setVoteDate(dayjs().startOf("day"));
      else setVoteDate(getInterestingDate());
      setIsDefaultPrev(false);
    },
  });

  //최초 접속
  useEffect(() => {
    if (voteDate) return;
    const currentHour = dayjs().hour();
    if (STUDY_VOTE_START_HOUR <= currentHour && currentHour < VOTER_DATE_END) {
      if (isGuest) setVoteDate(dayjs());
      else setIsDefaultPrev(true);
    } else setVoteDate(getInterestingDate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGuest]);

  //날짜 판단
  useEffect(() => {
    setIsMainLoading(true);
    setStudyDateStatus(null);
    if (!voteDate) return;
    const studyDateStatus = getStudyDate(voteDate);
    console.log(2, studyDateStatus);
    setStudyDateStatus(studyDateStatus);
    setMyStudyFixed(null);
    setParticipations(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voteDate]);

  return null;
}

export default DateSetting;
