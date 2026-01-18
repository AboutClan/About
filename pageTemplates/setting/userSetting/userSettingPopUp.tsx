import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { ComponentType, useEffect, useState } from "react";

import FAQModal from "../../../components/overlay/FAQModal";
import GatherRecordDrawer from "../../../components/overlay/GatherRecordDrawer";
import KakaoFriendModal from "../../../components/overlay/KakaoFriendModal";
import MonthlyScoreModal from "../../../components/overlay/MonthlyScoreModal";
import NewbeBenefitModal from "../../../components/overlay/NewBeBenefitModal";
import NewMemberModal from "../../../components/overlay/NewMemberModal";
import PointLowModal from "../../../components/overlay/PointLowModal";
import SelfIntroduceModal from "../../../components/overlay/SelfIntroduceModal";
import StudyRecordDrawer from "../../../components/overlay/StudyRecordDrawer";
import {
  FAQ_MODAL_AT,
  GATHER_REVIEW_MODAL_ID,
  KAKAO_FRIEND_AT,
  NEW_MEMBER_MODAL_AT,
  POINT_RECEIVE_AT,
} from "../../../constants/keys/localStorage";
import { STUDY_RECORD_MODAL_AT } from "../../../constants/keys/queryKeys";
import { useGatherReviewOneQuery } from "../../../hooks/gather/queries";
import { usePointCuoponLogQuery } from "../../../hooks/user/queries";
import { CloseProps } from "../../../types/components/modalTypes";
import { IUser } from "../../../types/models/userTypes/userInfoTypes";
import { checkAndSetLocalStorage } from "../../../utils/storageUtils";

export type PopUpType =
  | "studyRecord"
  | "faq"
  | "monthlyScore"
  | "gatherReview"
  | "introduce"
  | "newMember"
  | "pointReceive"
  | "kakaoFriend";

interface PopUpProps extends CloseProps {}

const MODAL_COMPONENTS: Record<PopUpType, ComponentType<PopUpProps>> = {
  studyRecord: StudyRecordDrawer,
  faq: FAQModal,
  monthlyScore: MonthlyScoreModal,
  gatherReview: GatherRecordDrawer,
  introduce: SelfIntroduceModal,
  newMember: NewMemberModal,
  pointReceive: PointLowModal,
  kakaoFriend: KakaoFriendModal,
};

export default function UserSettingPopUp({ user }: { user: IUser }) {
  const { data: session } = useSession();

  const [popUpType, setPopUpType] = useState<PopUpType[]>([]);

  const { data } = useGatherReviewOneQuery();

  const studyRecordStr = localStorage.getItem(STUDY_RECORD_MODAL_AT);
  const studyRecord = JSON.parse(studyRecordStr);
  const { data: hasKakaoCuopon, isLoading } = usePointCuoponLogQuery();

  console.log(33, hasKakaoCuopon);
  useEffect(() => {
    if (data === undefined || !session || isLoading) return;
    if (
      dayjs(user.registerDate).diff(dayjs(), "d") >= -30 &&
      !checkAndSetLocalStorage(NEW_MEMBER_MODAL_AT, 3)
    ) {
      setPopUpType((old) => [...old, "newMember"]);
      return;
    }
    if (!hasKakaoCuopon && !checkAndSetLocalStorage(KAKAO_FRIEND_AT, 20)) {
      setPopUpType((old) => [...old, "kakaoFriend"]);
      return;
    }
    if (data && localStorage.getItem(GATHER_REVIEW_MODAL_ID) !== data.id + "") {
      localStorage.setItem(GATHER_REVIEW_MODAL_ID, data.id + "");

      setPopUpType((old) => [...old, "gatherReview"]);
      return;
    }
    if (user?.point === 3000 && !checkAndSetLocalStorage(POINT_RECEIVE_AT, 30)) {
      setPopUpType((old) => [...old, "pointReceive"]);
      return;
    }

    // if (studyRecord && studyRecord?.date !== dayjsToStr(dayjs())) {
    //   setPopUpType((old) => [...old, "studyRecord"]);
    //   if (++popUpCnt < 2) return;
    // }

    // if (!checkAndSetLocalStorage(MONTHLY_SCORE_MODAL_AT, 10)) {
    //   setPopUpType((old) => [...old, "monthlyScore"]);
    //   return;
    // }
    if (!checkAndSetLocalStorage(FAQ_MODAL_AT, 30)) {
      setPopUpType((old) => [...old, "faq"]);
      return;
    }
  }, [data, session, user, isLoading]);

  const filterPopUpType = (type: PopUpType) => {
    setPopUpType((popUps) => popUps.filter((popUp) => popUp !== type));
  };

  return (
    <>
      {true && <NewbeBenefitModal />}
      {Object.entries(MODAL_COMPONENTS).map(([key, Component]) => {
        const type = key as PopUpType;
        const props =
          type === "studyRecord"
            ? {
                date: studyRecord?.date,
              }
            : type === "gatherReview"
            ? { date: data?.date, id: data?.id }
            : {};
        return (
          popUpType.includes(type) && (
            <Component {...props} key={type} onClose={() => filterPopUpType(type)} />
          )
        );
      })}
    </>
  );
}
