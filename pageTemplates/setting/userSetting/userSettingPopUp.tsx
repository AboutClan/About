import { useEffect, useState } from "react";

import {
  ALPHABET_POP_UP,
  ATTEND_POP_UP,
  ENTHUSIASTIC_POP_UP,
  FAQ_POP_UP,
  PROMOTION_POP_UP,
  SUGGEST_POP_UP,
  USER_GUIDE_POP_UP,
} from "../../../constants/keys/localStorage";
import EnthusiasticModal from "../../../modals/aboutHeader/EnthusiasticModal/EnthusiasticModal";
import PointSystemsModal from "../../../modals/aboutHeader/pointSystemsModal/PointSystemsModal";
import PromotionModal from "../../../modals/aboutHeader/promotionModal/PromotionModal";
import AlphabetPopUp from "../../../modals/pop-up/AlphabetPopUp";
import FAQPopUp from "../../../modals/pop-up/FAQPopUp";
import LastWeekAttendPopUp from "../../../modals/pop-up/LastWeekAttendPopUp";
import ManagerPopUp from "../../../modals/pop-up/ManagerPopUp";
import SuggestPopUp from "../../../modals/pop-up/SuggestPopUp";
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
  const [modalTypes, setModalTypes] = useState<UserPopUp[]>([]);

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
    // if (!checkAndSetLocalStorage(MANAGER_POP_UP, 30)) {
    //   setModalTypes((old) => [...old, "manager"]);
    //   if (++popUpCnt === 2) return;
    // }
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
