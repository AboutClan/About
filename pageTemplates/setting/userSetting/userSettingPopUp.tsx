import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ALPHABET_POP_UP,
  ATTEND_POP_UP,
  ENTHUSIASTIC_POP_UP,
  FAQ_POP_UP,
  GATHER_JOIN_MEMBERS,
  PROMOTION_POP_UP,
  STUDY_ATTEND_MEMBERS,
  SUGGEST_POP_UP,
  USER_GUIDE_POP_UP,
} from "../../../constants/keys/localStorage";
import { useGatherQuery } from "../../../hooks/gather/queries";
import EnthusiasticModal from "../../../modals/aboutHeader/EnthusiasticModal/EnthusiasticModal";
import PointSystemsModal from "../../../modals/aboutHeader/pointSystemsModal/PointSystemsModal";
import PromotionModal from "../../../modals/aboutHeader/promotionModal/PromotionModal";
import AlphabetPopUp from "../../../modals/pop-up/AlphabetPopUp";
import FAQPopUp from "../../../modals/pop-up/FAQPopUp";
import LastWeekAttendPopUp from "../../../modals/pop-up/LastWeekAttendPopUp";
import ManagerPopUp from "../../../modals/pop-up/ManagerPopUp";
import SuggestPopUp from "../../../modals/pop-up/SuggestPopUp";
import RecentJoinUserPopUp from "../../../modals/RecentJoinUserPopUp";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { LocationEn } from "../../../types/services/locationTypes";
import { convertLocationLangTo } from "../../../utils/convertUtils/convertDatas";
import { checkAndSetLocalStorage } from "../../../utils/storageUtils";

export type UserPopUp =
  | "lastWeekAttend"
  | "suggest"
  | "promotion"
  | "userGuide"
  | "faq"
  // | "manager"
  | "alphabet"
  | "enthusiastic";

const MODAL_COMPONENTS = {
  faq: FAQPopUp,
  lastWeekAttend: LastWeekAttendPopUp,
  suggest: SuggestPopUp,
  promotion: PromotionModal,
  userGuide: PointSystemsModal,
  alphabet: AlphabetPopUp,
  enthusiastic: EnthusiasticModal,
  manager: ManagerPopUp,
};

export default function UserSettingPopUp({ cnt }) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  const location = convertLocationLangTo(searchParams.get("location") as LocationEn, "kr");

  const [modalTypes, setModalTypes] = useState<UserPopUp[]>([]);
  const [recentMembers, setRecentMembers] = useState<IUserSummary[]>();

  const { data: gatherData } = useGatherQuery();

  useEffect(() => {
    if (!gatherData) return;

    const gatherJoin = JSON.parse(localStorage.getItem(GATHER_JOIN_MEMBERS)) || [];

    const filteredGather = gatherData.filter((obj) => {
      const isJoined = gatherJoin.includes(obj.id);
      const isWithinDateRange =
        dayjs(obj.date).isAfter(dayjs().subtract(7, "day")) &&
        dayjs(obj.date).isBefore(dayjs(), "dates");
      const isParticipant = obj.participants.some((who) => who.user.uid === session?.user.uid);
      const isUser = (obj.user as IUserSummary).uid === session?.user.uid;

      return !isJoined && isWithinDateRange && (isParticipant || isUser);
    });

    let temp = gatherJoin;
    filteredGather.forEach((obj) => {
      temp.push(obj.id);
    });
    temp.push(48);
    temp.sort((a, b) => a - b);
    if (temp.length >= 5) {
      temp.shift();
    }
    // localStorage.setItem(GATHER_JOIN_MEMBERS, JSON.stringify(temp));

    const sortedStudyMembers = JSON.parse(localStorage.getItem(STUDY_ATTEND_MEMBERS)) || [];

    let firstData;
    sortedStudyMembers.forEach((obj) => {
      if (dayjs(obj.date).isBefore(dayjs(), "dates")) {
        if (!firstData) {
          firstData = obj;
        } else if (dayjs(obj.date).isAfter(firstData.date)) {
          firstData = obj;
        }
      }
    });

    const filtered = sortedStudyMembers.filter(
      (obj) => !dayjs(obj.date).isBefore(dayjs(), "dates"),
    );

    const gatherMembers = filteredGather.flatMap((obj) => obj.participants.map((who) => who.user));

    setRecentMembers([...gatherMembers, ...(firstData ? firstData.members : [])]);
    console.log(23, firstData, filtered);
  }, [gatherData]);

  console.log(14, recentMembers);

  useEffect(() => {
    let popUpCnt = cnt;
    if (!checkAndSetLocalStorage(ALPHABET_POP_UP, 15)) {
      setModalTypes((old) => [...old, "alphabet"]);
      if (++popUpCnt === 2) return;
    }
    if (!checkAndSetLocalStorage(ATTEND_POP_UP, 7)) {
      setModalTypes((old) => [...old, "lastWeekAttend"]);
      if (++popUpCnt === 2) return;
    }
    if (!checkAndSetLocalStorage(ENTHUSIASTIC_POP_UP, 16)) {
      setModalTypes((old) => [...old, "enthusiastic"]);
      if (++popUpCnt === 2) return;
    }
    if (!checkAndSetLocalStorage(FAQ_POP_UP, 14)) {
      setModalTypes((old) => [...old, "faq"]);
      if (++popUpCnt === 2) return;
    }

    if (!checkAndSetLocalStorage(PROMOTION_POP_UP, 8)) {
      setModalTypes((old) => [...old, "promotion"]);
      if (++popUpCnt === 2) return;
    }
    if (!checkAndSetLocalStorage(SUGGEST_POP_UP, 21)) {
      setModalTypes((old) => [...old, "suggest"]);
      if (++popUpCnt === 2) return;
    }
    if (!checkAndSetLocalStorage(USER_GUIDE_POP_UP, 22)) {
      setModalTypes((old) => [...old, "userGuide"]);
      if (++popUpCnt === 2) return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterModalTypes = (type: UserPopUp) => {
    setModalTypes((popUps) => popUps.filter((popUp) => popUp !== type));
  };

  return (
    <>
      {recentMembers && (
        <RecentJoinUserPopUp users={recentMembers} setIsModal={() => setRecentMembers(null)} />
      )}
      {Object.entries(MODAL_COMPONENTS).map(([key, Component]) => {
        const type = key as UserPopUp;
        return (
          modalTypes.includes(type) && (
            <Component key={type} setIsModal={() => filterModalTypes(type)} />
          )
        );
      })}
    </>
  );
}
