import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSetRecoilState } from "recoil";

import { GATHER_COVER_IMAGE_ARR } from "../../../assets/gather";
import MenuButton, { MenuProps } from "../../../components/atoms/buttons/MenuButton";
import Header from "../../../components/layouts/Header";
import UserAbsenceBoard from "../../../components/organisms/boards/UserAbsenceBoard";
import UserApprovalBoard from "../../../components/organisms/boards/UserApprovalBoard";
import UserDeleteBoard from "../../../components/organisms/boards/UserDeleteBoard";
import UserInviteBoard from "../../../components/organisms/boards/UserInviteBoard";
import RightDrawer from "../../../components/organisms/drawer/RightDrawer";
import { useResetGatherQuery } from "../../../hooks/custom/CustomHooks";
import { useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import {
  useGatherAbsenceCheckMutation,
  useGatherParticipationMutation,
  useGatherStatusMutation,
  useGatherWaitingStatusMutation,
} from "../../../hooks/gather/mutations";
import { isGatherEditState } from "../../../recoils/checkAtoms";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import { getRandomImage } from "../../../utils/imageUtils";

interface IGatherHeader {
  gatherData: IGather;
}
type ModalType = "inviteMember" | "waitingMember" | "removeMember" | "exile" | "absence";

function GatherHeader({ gatherData }: IGatherHeader) {
  const router = useRouter();
  const toast = useToast();
  const resetQuery = useResetGatherQuery();
  const typeToast = useTypeToast();
  const setGatherWriting = useSetRecoilState(sharedGatherWritingState);
  const setIsGatherEdit = useSetRecoilState(isGatherEditState);
  const [modalType, setModalType] = useState<ModalType>(null);

  const { data: session } = useSession();

  const isAdmin =
    (gatherData?.user as UserSimpleInfoProps)._id === session?.user.id ||
    session?.user.uid === "2259633694" ||
    session?.user.uid === "3224546232";

  const { mutate: absenceCheck } = useGatherAbsenceCheckMutation(+gatherData.id);

  const { mutate: changeStatus } = useGatherStatusMutation(+gatherData.id, {
    onSuccess() {
      typeToast("change");
      resetQuery();
    },
  });

  const { mutate: deleteUser } = useGatherParticipationMutation("delete", +gatherData.id, {
    onSuccess() {
      resetQuery();
    },
  });

  const { mutate } = useGatherWaitingStatusMutation(gatherData.id, {
    onSuccess() {
      resetQuery();
    },
    onError() {
      toast("error", "상대가 보유중인 참여권이 없습니다.");
      resetQuery();
    },
  });

  const menuArr: MenuProps[] = [
    ...(isAdmin
      ? [
          gatherData?.status === "pending"
            ? {
                text: "신청 인원 확인",
                hasWaiting: !!gatherData?.waiting?.length,
                icon: <MemberCheckIcon />,
                func: () => {
                  setModalType("waitingMember");
                },
              }
            : {
                text: "불참 인원 체크",
                icon: <MemberCheckIcon />,
                func: () => {
                  setModalType("absence");
                },
              },
          {
            text: "모임 정보 수정",
            icon: <EditIcon />,
            func: () => {
              setGatherWriting({ ...gatherData, date: dayjs(gatherData.date).toString() });
              setIsGatherEdit(true);
              router.push(`/gather/writing/category?id=${gatherData.id}&edit=on`);
            },
          },
          {
            text: "인원 초대",
            icon: <MemberInviteIcon />,
            func: () => {
              setModalType("inviteMember");
            },
          },
          {
            text: "참여 인원 관리",
            icon: <MemberMinusIcon />,
            func: () => {
              setModalType("removeMember");
            },
          },
          ...(gatherData?.status !== "pending"
            ? [
                {
                  text: "모집중으로 상태 변경",
                  icon: <ChangeStatusIcon />,
                  func: () => {
                    changeStatus("pending");
                  },
                },
              ]
            : []),
        ]
      : []),

    {
      kakaoOptions: {
        title: gatherData.title,
        date: gatherData.date,
        subtitle: gatherData?.content,
        img: gatherData?.coverImage || getRandomImage(GATHER_COVER_IMAGE_ARR["공통"]),
        url: "https://study-about.club" + router.asPath,
      },
    },
  ];

  const handleUserStatus = async (userId: string, status: "agree" | "refuse") => {
    await mutate({ userId, status, text: null });

    if (status === "agree") toast("success", "승인되었습니다.");
    else if (status === "refuse") toast("success", "거절했습니다.");
  };

  return (
    <>
      <Header title="모임 정보" url="/gather">
        <Box pos="relative">
          <MenuButton menuArr={menuArr} isBlack={!!gatherData?.waiting?.length} />
        </Box>
      </Header>
      {modalType === "waitingMember" && (
        <RightDrawer title="신청중인 인원" onClose={() => setModalType(null)}>
          <UserApprovalBoard
            users={gatherData.waiting.map((who) => ({
              user: who.user,
              text: who.phase === "first" ? "1차 참여" : "2차 참여",
            }))}
            handleApprove={(userId) => handleUserStatus(userId, "agree")}
            handleRefuse={(userId) => handleUserStatus(userId, "refuse")}
          />
        </RightDrawer>
      )}

      {modalType === "inviteMember" && (
        <RightDrawer title="인원 초대" onClose={() => setModalType(null)}>
          <UserInviteBoard
            gatherId={gatherData.id + ""}
            groupId={gatherData?.groupId}
            members={gatherData.participants.map((who) => who.user._id)}
          />
        </RightDrawer>
      )}
      {modalType === "removeMember" && (
        <RightDrawer title="참여중인 인원" onClose={() => setModalType(null)}>
          <UserDeleteBoard
            users={gatherData.participants.map((who) => ({
              user: who.user,
              text: who.user.comment,
            }))}
            handleDelete={(userId) => deleteUser({ userId })}
          />
        </RightDrawer>
      )}
      {modalType === "absence" && (
        <RightDrawer title="불참 체크" onClose={() => setModalType(null)}>
          <UserAbsenceBoard
            users={gatherData.participants.map((who) => ({
              user: who.user,
              text: who.user.comment,
              isAbsence: who?.absence,
            }))}
            handleDelete={(userId) => absenceCheck({ userId })}
          />
        </RightDrawer>
      )}
    </>
  );
}

export function CheckCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--color-gray)"
    >
      <path d="m424-408-86-86q-11-11-28-11t-28 11q-11 11-11 28t11 28l114 114q12 12 28 12t28-12l226-226q11-11 11-28t-11-28q-11-11-28-11t-28 11L424-408Zm56 328q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
    </svg>
  );
}

export function MemberMinusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--color-gray)"
    >
      <path d="M680-600h160q17 0 28.5 11.5T880-560q0 17-11.5 28.5T840-520H680q-17 0-28.5-11.5T640-560q0-17 11.5-28.5T680-600ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-240v-32q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v32q0 33-23.5 56.5T600-160H120q-33 0-56.5-23.5T40-240Z" />
    </svg>
  );
}

export function MemberCheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--color-gray)"
    >
      <path d="m702-593 141-142q12-12 28.5-12t28.5 12q12 12 12 28.5T900-678L730-508q-12 12-28 12t-28-12l-85-85q-12-12-12-28.5t12-28.5q12-12 28-12t28 12l57 57ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-240v-32q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v32q0 33-23.5 56.5T600-160H120q-33 0-56.5-23.5T40-240Z" />
    </svg>
  );
}
export function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--color-gray)"
    >
      <path d="M160-120q-17 0-28.5-11.5T120-160v-97q0-16 6-30.5t17-25.5l505-504q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L313-143q-11 11-25.5 17t-30.5 6h-97Zm544-528 56-56-56-56-56 56 56 56Z" />
    </svg>
  );
}

export function MemberInviteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--color-gray)"
    >
      <path d="M720-520h-80q-17 0-28.5-11.5T600-560q0-17 11.5-28.5T640-600h80v-80q0-17 11.5-28.5T760-720q17 0 28.5 11.5T800-680v80h80q17 0 28.5 11.5T920-560q0 17-11.5 28.5T880-520h-80v80q0 17-11.5 28.5T760-400q-17 0-28.5-11.5T720-440v-80Zm-360 40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-240v-32q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v32q0 33-23.5 56.5T600-160H120q-33 0-56.5-23.5T40-240Z" />
    </svg>
  );
}

export function ChangeStatusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--color-gray)"
    >
      <path d="M480-760q-69 0-129 32t-101 88h70q17 0 28.5 11.5T360-600q0 17-11.5 28.5T320-560H160q-17 0-28.5-11.5T120-600v-160q0-17 11.5-28.5T160-800q17 0 28.5 11.5T200-760v54q51-64 124.5-99T480-840q75 0 140.5 28T735-735q42 42 69 97t34 118q2 17-10 28t-29 11q-17 0-28.5-11T757-520q-7-46-27-86t-52-72q-38-38-88.5-60T480-760ZM164-434q16-2 29 6t18 24q22 81 85 135t146 65q21 3 30 15.5t9 26.5q0 16-10.5 29T441-122q-111-13-195.5-85.5T132-387q-5-17 5-31t27-16Zm356-62 48 48q14 14 12.5 29.5T568-392q-11 11-26.5 12.5T512-392l-60-60q-6-6-9-13.5t-3-15.5v-159q0-17 11.5-28.5T480-680q17 0 28.5 11.5T520-640v144ZM751 0q-14 0-24.5-9T713-32l-6-28q-12-5-22.5-10.5T663-84l-29 9q-13 4-25.5-1T589-92l-8-14q-7-12-5-26t13-23l22-19q-2-13-2-26t2-26l-22-19q-11-9-13-22.5t5-25.5l9-15q7-11 19-16t25-1l29 9q11-8 21.5-13.5T707-340l6-29q3-14 13.5-22.5T751-400h16q14 0 24.5 9t13.5 23l6 28q12 5 23 11.5t21 14.5l27-9q14-5 27 0t20 17l8 14q7 12 5 26t-13 23l-22 19q2 13 2 25t-2 25l22 19q11 9 13 22.5t-5 25.5l-9 15q-7 11-19 16t-25 1l-29-9q-11 8-21.5 13.5T811-60l-6 29q-3 14-13.5 22.5T767 0h-16Zm8-120q33 0 56.5-23.5T839-200q0-33-23.5-56.5T759-280q-33 0-56.5 23.5T679-200q0 33 23.5 56.5T759-120Z" />
    </svg>
  );
}

export default GatherHeader;
