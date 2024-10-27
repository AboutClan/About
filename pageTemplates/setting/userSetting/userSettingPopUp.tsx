import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import BottomFlexDrawer from "../../../components/organisms/drawer/BottomFlexDrawer";
import {
  ATTEND_POP_UP,
  FAQ_POP_UP,
  GATHER_JOIN_MEMBERS,
  PROMOTION_POP_UP,
  STUDY_ATTEND_MEMBERS,
  STUDY_RECORD,
} from "../../../constants/keys/localStorage";
import { useGatherQuery } from "../../../hooks/gather/queries";
import PromotionModal from "../../../modals/aboutHeader/promotionModal/PromotionModal";
import FAQPopUp from "../../../modals/pop-up/FAQPopUp";
import LastWeekAttendPopUp from "../../../modals/pop-up/LastWeekAttendPopUp";
import LocationRegisterPopUp from "../../../modals/pop-up/LocationRegisterPopUp";
import StudyChallengeModal from "../../../modals/pop-up/StudyChallengeModal";
import { IUser, IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import { checkAndSetLocalStorage } from "../../../utils/storageUtils";

export type UserPopUp =
  | "lastWeekAttend"
  // | "suggest"
  | "promotion"
  | "userGuide"
  | "faq"
  // | "manager"
  // | "alphabet"
  // | "enthusiastic"
  // | "instagram"
  | "registerLocation"
  | "studyChallenge";

const MODAL_COMPONENTS = {
  faq: FAQPopUp,
  lastWeekAttend: LastWeekAttendPopUp,
  // suggest: SuggestPopUp,
  promotion: PromotionModal,
  // userGuide: PointSystemsModal,
  // alphabet: AlphabetPopUp,
  // enthusiastic: EnthusiasticModal,
  // manager: ManagerPopUp,
  // instagram: InstaPopUp,
  registerLocation: LocationRegisterPopUp,
  studyChallenge: StudyChallengeModal,
};

interface UserSettingPopUpProps {
  userInfo: IUser;
}

export default function UserSettingPopUp({ userInfo }: UserSettingPopUpProps) {
  const { data: session } = useSession();

  const [modalTypes, setModalTypes] = useState<UserPopUp[]>([]);
  // const [recentMembers, setRecentMembers] = useState<IUserSummary[]>();
  const [drawerType, setDrawerType] = useState<"bottom" | "right">();

  const { data: gatherData } = useGatherQuery(-1);

  const studyRecordStr = localStorage.getItem(STUDY_RECORD);
  const studyRecord = JSON.parse(studyRecordStr);
  useEffect(() => {
    return;
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
    // const popUpCnt = cnt;

    if (!userInfo?.locationDetail) {
      setModalTypes((old) => [...old, "registerLocation"]);
      return;
    }

    // if (!checkAndSetLocalStorage(ALPHABET_POP_UP, 15)) {
    //   setModalTypes((old) => [...old, "alphabet"]);
    //   return;
    // }
    if (!checkAndSetLocalStorage(ATTEND_POP_UP, 7)) {
      setModalTypes((old) => [...old, "lastWeekAttend"]);
      return;
    }
    // if (!checkAndSetLocalStorage(ENTHUSIASTIC_POP_UP, 27)) {
    //   setModalTypes((old) => [...old, "enthusiastic"]);
    //   if (popUpCnt++ === 2) return;
    // }
    if (!checkAndSetLocalStorage(FAQ_POP_UP, 21)) {
      setModalTypes((old) => [...old, "faq"]);
      return;
    }

    if (!checkAndSetLocalStorage(PROMOTION_POP_UP, 14)) {
      setModalTypes((old) => [...old, "promotion"]);
      return;
    }
    if (userInfo?.weekStudyTragetHour === 0) {
      setModalTypes((old) => [...old, "studyChallenge"]);
    }

    if (studyRecord && studyRecord?.date !== dayjsToStr(dayjs())) {
      setDrawerType("bottom");
    }

    // if (!checkAndSetLocalStorage(SUGGEST_POP_UP, 29)) {
    //   setModalTypes((old) => [...old, "suggest"]);
    //   if (popUpCnt++ === 2) return;
    // }
    // if (!checkAndSetLocalStorage(USER_GUIDE_POP_UP, 30)) {
    //   setModalTypes((old) => [...old, "userGuide"]);
    //   if (popUpCnt++ === 2) return;
    // }
    // if (!checkAndSetLocalStorage(INSTAGRAM_POP_UP, 26) && !userInfo?.instagram) {
    //   setModalTypes((old) => [...old, "instagram"]);
    //   if (popUpCnt++ === 2) return;
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterModalTypes = (type: UserPopUp) => {
    setModalTypes((popUps) => popUps.filter((popUp) => popUp !== type));
  };

  return (
    <>
      {/* {recentMembers?.length ? (
        <RecentJoinUserPopUp
          users={recentMembers.filter((who) => who.uid !== session?.user.uid)}
          setIsModal={() => setRecentMembers(null)}
        />
      ) : null} */}

      {Object.entries(MODAL_COMPONENTS).map(([key, Component]) => {
        const type = key as UserPopUp;
        return (
          modalTypes.includes(type) && (
            <Component key={type} setIsModal={() => filterModalTypes(type)} />
          )
        );
      })}

      {drawerType === "bottom" && (
        <BottomFlexDrawer
          isDrawerUp
          isOverlay
          height={429}
          isHideBottom
          setIsModal={() => setDrawerType(null)}
        >
          <Box
            py={3}
            lineHeight="32px"
            w="100%"
            fontWeight="semibold"
            fontSize="20px"
            textAlign="start"
          >
            지난 스터디 결과가 도착했어요 <br /> 기록을 확인해볼까요?
          </Box>
          <Box p={5}>
            <Image src="/51.png" width={160} height={160} alt="studyResult" />
          </Box>

          <Flex direction="column" mt="auto" w="100%">
            <Link href={`/study/result?date=${studyRecord?.date}`} style={{ width: "100%" }}>
              <Button w="full" size="lg" colorScheme="black" onClick={() => setDrawerType("right")}>
                확인 하러가기
              </Button>
            </Link>
            <Button
              my={2}
              h="24px"
              color="gray.500"
              fontWeight="semibold"
              variant="ghost"
              onClick={() => setDrawerType(null)}
            >
              무시하고 넘기기
            </Button>
          </Flex>
        </BottomFlexDrawer>
      )}

      {/* {drawerType === "right" && <RightDrawer>23</RightDrawer>} */}
    </>
  );
}
