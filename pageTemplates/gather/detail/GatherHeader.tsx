import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";

import MenuButton, { MenuProps } from "../../../components/atoms/buttons/MenuButton";
import Header from "../../../components/layouts/Header";
import UserApprovalBoard from "../../../components/organisms/boards/UserApprovalBoard";
import RightDrawer from "../../../components/organisms/drawer/RightDrawer";
import { GATHER_CONTENT } from "../../../constants/keys/queryKeys";
import { useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import {
  useGatherStatusMutation,
  useGatherWaitingStatusMutation,
} from "../../../hooks/gather/mutations";
import InviteUserModal from "../../../modals/InviteUserModal";
import { isGatherEditState } from "../../../recoils/checkAtoms";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";

interface IGatherHeader {
  gatherData: IGather;
}
type ModalType = "inviteMember" | "waitingMember" | "removeMember" | "exile";

function GatherHeader({ gatherData }: IGatherHeader) {
  const router = useRouter();
  const toast = useToast();
  const typeToast = useTypeToast();
  const setGatherWriting = useSetRecoilState(sharedGatherWritingState);
  const setIsGatherEdit = useSetRecoilState(isGatherEditState);
  const [modalType, setModalType] = useState<ModalType>(null);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const id = gatherData?.id;

  const isAdmin =
    (gatherData?.user as UserSimpleInfoProps)._id === session?.user.id ||
    session?.user.uid === "2259633694";

  const { mutate: changeStatus } = useGatherStatusMutation(+gatherData.id, {
    onSuccess() {
      typeToast("change");
    },
  });

  const { mutate } = useGatherWaitingStatusMutation(gatherData.id, {
    onSuccess() {
      queryClient.invalidateQueries([GATHER_CONTENT, id]);
    },
    onError() {
      toast("error", "상대가 보유중인 참여권이 없습니다.");
      queryClient.invalidateQueries([GATHER_CONTENT, id]);
    },
  });

  const menuArr: MenuProps[] = [
    ...(isAdmin
      ? [
          {
            text: "모임 정보 수정",
            func: () => {
              setGatherWriting({ ...gatherData, date: dayjs(gatherData.date) });
              setIsGatherEdit(true);
              router.push(`/gather/writing/category?id=${gatherData.id}`);
            },
          },
          {
            text: "참여 대기 인원 확인",
            func: () => {
              setModalType("waitingMember");
            },
          },
          {
            text: "인원 초대",
            func: () => {
              setModalType("inviteMember");
            },
          },
          {
            text: "인원 내보내기",
            func: () => {
              typeToast("not-yet");
            },
          },
          ...(gatherData?.status !== "pending"
            ? [
                {
                  text: "모임중으로 상태 변경",
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
        subtitle: gatherData?.content,
        // img: gatherData?.squareImage,
        url: "https://study-about.club" + router.asPath,
      },
    },
  ];

  const handleUserStatus = async (userId: string, status: "agree" | "refuse") => {
    await mutate({ userId, status, text: null });
  };

  return (
    <>
      <Header title="모임 정보">
        <MenuButton menuArr={menuArr} />
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
        <InviteUserModal
          prevUsers={[...gatherData.participants.map((par) => par.user)]}
          setIsModal={() => setModalType(null)}
        />
      )}
    </>
  );
}

export default GatherHeader;
