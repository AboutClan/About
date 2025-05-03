import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { ComponentType, useEffect, useState } from "react";
import FAQModal from "../../../components/overlay/FAQModal";
import MonthlyScoreModal from "../../../components/overlay/MonthlyScoreModal";

import StudyRecordDrawer from "../../../components/overlay/StudyRecordDrawer";
import {
  FAQ_MODAL_AT,
  GATHER_JOIN_MEMBERS,
  MONTHLY_SCORE_MODAL_AT,
  STUDY_ATTEND_MEMBERS,
} from "../../../constants/keys/localStorage";
import { STUDY_RECORD_MODAL_AT } from "../../../constants/keys/queryKeys";
import { useGatherQuery } from "../../../hooks/gather/queries";
import { CloseProps } from "../../../types/components/modalTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import { checkAndSetLocalStorage } from "../../../utils/storageUtils";

export type PopUpType = "studyRecord" | "faq" | "monthlyScore";

interface PopUpProps extends CloseProps {}

const MODAL_COMPONENTS: Record<PopUpType, ComponentType<PopUpProps>> = {
  studyRecord: StudyRecordDrawer,
  faq: FAQModal,
  monthlyScore: MonthlyScoreModal,
};

export default function UserSettingPopUp() {
  const { data: session } = useSession();

  const [popUpType, setPopUpType] = useState<PopUpType[]>([]);

  const [recentMembers, setRecentMembers] = useState<IUserSummary[]>();

  const { data: gatherData } = useGatherQuery(-1);

  const studyRecordStr = localStorage.getItem(STUDY_RECORD_MODAL_AT);
  const studyRecord = JSON.parse(studyRecordStr);

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

    const temp = gatherJoin;
    filteredGather.forEach((obj) => {
      temp.push(obj.id);
    });

    temp.sort((a, b) => a - b);
    if (temp.length >= 5) {
      temp.shift();
    }

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

    localStorage.setItem(GATHER_JOIN_MEMBERS, JSON.stringify(temp));
    localStorage.setItem(STUDY_ATTEND_MEMBERS, JSON.stringify(filtered));

    // const gatherMembers = filteredGather.flatMap((obj) => obj.participants.map((who) => who.user));

    // setRecentMembers([...gatherMembers, ...(firstData ? firstData.members : [])]);
  }, [gatherData]);

  useEffect(() => {
    let popUpCnt = 0;

    if (studyRecord && studyRecord?.date !== dayjsToStr(dayjs())) {
      setPopUpType((old) => [...old, "studyRecord"]);
      popUpCnt++;
    }

    if (!checkAndSetLocalStorage(MONTHLY_SCORE_MODAL_AT, 10)) {
      setPopUpType((old) => [...old, "monthlyScore"]);
      return;
    }

    if (!checkAndSetLocalStorage(FAQ_MODAL_AT, 20)) {
      setPopUpType((old) => [...old, "faq"]);
      return;
    }
  }, []);

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
                studyRecord: {
                  date: "2024-02-02",
                },
              }
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
