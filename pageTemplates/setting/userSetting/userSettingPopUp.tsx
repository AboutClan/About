import { useEffect, useState } from "react";
import { NEW_POINT_SYSTEM } from "../../../constants/contents/PopUpContents";
import {
  ALPHABET_POP_UP,
  ATTEND_POP_UP,
  ENTHUSIASTIC_POP_UP,
  FAQ_POP_UP,
  MANAGER_POP_UP,
  NEW_POINT_SYSTEM_POP_UP,
  PROMOTION_POP_UP,
  SUGGEST_POP_UP,
  USER_GUIDE_POP_UP,
} from "../../../constants/keys/localStorage";
import { checkAndSetLocalStorage } from "../../../helpers/storageHelpers";
import ContentPopUp from "../../../modals/common/ContentPopUp";
import EnthusiasticModal from "../../../modals/homeHeader/EnthusiasticModal/EnthusiasticModal";
import PointSystemsModal from "../../../modals/homeHeader/pointSystemsModal/PointSystemsModal";
import PromotionModal from "../../../modals/homeHeader/promotionModal/PromotionModal";
import AlphabetPopUp from "../../../modals/pop-up/AlphabetPopUp";
import FAQPopUp from "../../../modals/pop-up/FAQPopUp";
import FreestudyPopUp from "../../../modals/pop-up/FreestudyPopUp";
import LastWeekAttendPopUp from "../../../modals/pop-up/LastWeekAttendPopUp";
import SuggestPopUp from "../../../modals/pop-up/SuggestPopUp";

export type UserPopUp =
  | "lastWeekAttend"
  | "profileEdit"
  | "suggest"
  | "promotion"
  | "userGuide"
  | "faq"
  | "manager"
  | "alphabet"
  | "newPointSystem"
  | "enthusiastic"
  | "study";

function UserSettingPopUp({ cnt }) {
  const [popUpTypes, setPopUpTypes] = useState<UserPopUp[]>([]);

  useEffect(() => {
    let popUpCnt = cnt;

    // if (isProfileEdit) setPopUpTypes((old) => [...old, "profileEdit"]);

    if (!checkAndSetLocalStorage(ENTHUSIASTIC_POP_UP, 4)) {
      setPopUpTypes((old) => [...old, "enthusiastic"]);
      if (++popUpCnt === 2) return;
    }
    if (!checkAndSetLocalStorage(NEW_POINT_SYSTEM_POP_UP, 22)) {
      setPopUpTypes((old) => [...old, "newPointSystem"]);
      if (++popUpCnt === 2) return;
    }
    if (!checkAndSetLocalStorage(ALPHABET_POP_UP, 27)) {
      setPopUpTypes((old) => [...old, "alphabet"]);
      if (++popUpCnt === 2) return;
    }
    if (!checkAndSetLocalStorage("study", 5)) {
      setPopUpTypes((old) => [...old, "study"]);
      if (++popUpCnt === 2) return;
    }
    if (!checkAndSetLocalStorage(FAQ_POP_UP, 9)) {
      setPopUpTypes((old) => [...old, "faq"]);
      if (++popUpCnt === 2) return;
    }

    if (!checkAndSetLocalStorage(USER_GUIDE_POP_UP, 21)) {
      setPopUpTypes((old) => [...old, "userGuide"]);
      if (++popUpCnt === 2) return;
    }
    if (!checkAndSetLocalStorage(PROMOTION_POP_UP, 4)) {
      setPopUpTypes((old) => [...old, "promotion"]);
      if (++popUpCnt === 2) return;
    }
    if (!checkAndSetLocalStorage(SUGGEST_POP_UP, 7)) {
      setPopUpTypes((old) => [...old, "suggest"]);
      if (++popUpCnt === 2) return;
    }
    if (!checkAndSetLocalStorage(ATTEND_POP_UP, 7)) {
      setPopUpTypes((old) => [...old, "lastWeekAttend"]);
      if (++popUpCnt === 2) return;
    }
    if (!checkAndSetLocalStorage(MANAGER_POP_UP, 10)) {
      setPopUpTypes((old) => [...old, "manager"]);
      if (++popUpCnt === 2) return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterPopUpTypes = (type: UserPopUp) => {
    setPopUpTypes((popUps) => popUps.filter((popUp) => popUp !== type));
  };

  return (
    <>
      {popUpTypes.includes("faq") && (
        <FAQPopUp setIsModal={() => filterPopUpTypes("faq")} />
      )}

      {popUpTypes.includes("lastWeekAttend") && (
        <LastWeekAttendPopUp
          setIsModal={() => filterPopUpTypes("lastWeekAttend")}
        />
      )}
      {/* {popUpTypes.includes("profileEdit") && (
        <ProfileModifyPopUp
          setIsModal={() => filterPopUpTypes("profileEdit")}
        />
      )} */}
      {popUpTypes.includes("study") && (
        <FreestudyPopUp setIsModal={() => filterPopUpTypes("study")} />
      )}
      {popUpTypes.includes("suggest") && (
        <SuggestPopUp setIsModal={() => filterPopUpTypes("suggest")} />
      )}
      {popUpTypes.includes("promotion") && (
        <PromotionModal setIsModal={() => filterPopUpTypes("promotion")} />
      )}
      {popUpTypes.includes("userGuide") && (
        <PointSystemsModal setIsModal={() => filterPopUpTypes("userGuide")} />
      )}
      {/* {!popUpTypes.includes("manager") && (
        <ManagerPopUp setIsModal={() => filterPopUpTypes("manager")} />
      )} */}

      {popUpTypes.includes("alphabet") && (
        <AlphabetPopUp
          setIsModal={() => {
            filterPopUpTypes("alphabet");
          }}
        />
      )}
      {popUpTypes.includes("newPointSystem") && (
        <ContentPopUp
          content={NEW_POINT_SYSTEM}
          setIsModal={() => filterPopUpTypes("newPointSystem")}
        />
      )}
      {popUpTypes.includes("enthusiastic") && (
        <EnthusiasticModal
          setIsModal={() => filterPopUpTypes("enthusiastic")}
        />
      )}
    </>
  );
}

export default UserSettingPopUp;