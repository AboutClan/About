import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { ComponentType, useEffect, useState } from "react";

import FAQModal from "../../../components/overlay/FAQModal";
import GatherRecordDrawer from "../../../components/overlay/GatherRecordDrawer";
import MonthlyScoreModal from "../../../components/overlay/MonthlyScoreModal";
import StudyRecordDrawer from "../../../components/overlay/StudyRecordDrawer";
import { FAQ_MODAL_AT } from "../../../constants/keys/localStorage";
import { STUDY_RECORD_MODAL_AT } from "../../../constants/keys/queryKeys";
import { useGatherReviewOneQuery } from "../../../hooks/gather/queries";
import { CloseProps } from "../../../types/components/modalTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import { checkAndSetLocalStorage } from "../../../utils/storageUtils";

export type PopUpType = "studyRecord" | "faq" | "monthlyScore" | "gatherReview";

interface PopUpProps extends CloseProps {}

const MODAL_COMPONENTS: Record<PopUpType, ComponentType<PopUpProps>> = {
  studyRecord: StudyRecordDrawer,
  faq: FAQModal,
  monthlyScore: MonthlyScoreModal,
  gatherReview: GatherRecordDrawer,
};

export default function UserSettingPopUp() {
  const { data: session } = useSession();

  const [popUpType, setPopUpType] = useState<PopUpType[]>([]);

  const { data } = useGatherReviewOneQuery();

  const studyRecordStr = localStorage.getItem(STUDY_RECORD_MODAL_AT);
  const studyRecord = JSON.parse(studyRecordStr);

  useEffect(() => {
    if (data === undefined || !session) return;

    let popUpCnt = 0;
    if (data) {
      setPopUpType((old) => [...old, "gatherReview"]);
      if (++popUpCnt < 2) return;
    }

    if (studyRecord && studyRecord?.date !== dayjsToStr(dayjs())) {
      setPopUpType((old) => [...old, "studyRecord"]);
      if (++popUpCnt < 2) return;
    }

    // if (!checkAndSetLocalStorage(MONTHLY_SCORE_MODAL_AT, 10)) {
    //   setPopUpType((old) => [...old, "monthlyScore"]);
    //   if (++popUpCnt < 2) return;
    // }
    if (!checkAndSetLocalStorage(FAQ_MODAL_AT, 20)) {
      setPopUpType((old) => [...old, "faq"]);
      if (++popUpCnt < 2) return;
    }
  }, [data, session]);

  const filterPopUpType = (type: PopUpType) => {
    setPopUpType((popUps) => popUps.filter((popUp) => popUp !== type));
  };

  return (
    <>
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
