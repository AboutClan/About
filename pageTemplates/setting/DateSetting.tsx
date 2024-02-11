import dayjs from "dayjs";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { MY_TODAY_STUDY_FIXED } from "../../constants/keys/localStorage";
import {
  STUDY_VOTE_START_HOUR,
  VOTER_DATE_END,
} from "../../constants/settingValue/study/study";
import { dayjsToStr, getCurrentDate, getHour } from "../../helpers/dateHelpers";

import { getInterestingDate } from "../../helpers/studyHelpers";
import { isMainLoadingState } from "../../recoil/loadingAtoms";
import { participationsState, voteDateState } from "../../recoil/studyAtoms";
import { isGuestState } from "../../recoil/userAtoms";

function DateSetting() {
  const isGuest = useRecoilValue(isGuestState);
  const [voteDate, setVoteDate] = useRecoilState(voteDateState);
  const setParticipations = useSetRecoilState(participationsState);
  const setIsMainLoading = useSetRecoilState(isMainLoadingState);

  const currentDate = getCurrentDate();

  // 최초 voteDate 설정
  useEffect(() => {
    if (voteDate || isGuest === undefined) return;
    const currentHour = getHour();
    if (STUDY_VOTE_START_HOUR <= currentHour && currentHour < VOTER_DATE_END) {
      const todayStudy = localStorage.getItem(MY_TODAY_STUDY_FIXED);
      if (isGuest || todayStudy === dayjsToStr(dayjs())) {
        setVoteDate(currentDate);
        return;
      }
    }
    //voteDate는 투표 시작 기준 시간까지는 오늘. 이후는 내일 날짜.
    setVoteDate(getInterestingDate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGuest]);

  //voteDate가 변경될 때 세팅
  useEffect(() => {
    setIsMainLoading(true);
    if (!voteDate) return;
    setParticipations(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voteDate]);

  return null;
}

export default DateSetting;