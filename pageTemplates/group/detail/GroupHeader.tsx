import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

import AlertModal, { IAlertModalOptions } from "../../../components/AlertModal";
import MenuButton, { MenuProps } from "../../../components/atoms/buttons/MenuButton";
import Header from "../../../components/layouts/Header";
import { GROUP_WRITING_STORE } from "../../../constants/keys/localStorage";
import { useResetGroupQuery } from "../../../hooks/custom/CustomHooks";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useGroupParticipationMutation } from "../../../hooks/groupStudy/mutations";
import { IGroup } from "../../../types/models/groupTypes/group";
import { setLocalStorageObj } from "../../../utils/storageUtils";
import { EditIcon, MemberCheckIcon, MemberMinusIcon } from "../../gather/detail/GatherHeader";

interface IGroupHeader {
  group: IGroup;
}

function GroupHeader({ group }: IGroupHeader) {
  const router = useRouter();
  const { data: session } = useSession();
  const resetGroupQuery = useResetGroupQuery();
  const toast = useToast();

  const isAdmin =
    session?.user.uid === "2259633694" ||
    session?.user.uid === "3224546232" ||
    group?.organizer.uid === session?.user.uid;
  const isMember =
    session?.user.uid === "2259633694" ||
    session?.user.uid === "3224546232" ||
    group?.participants.some((par) => par.user?.uid === session?.user.uid);

  const [isSettigModal, setIsSettingModal] = useState(false);

  const { mutate } = useGroupParticipationMutation("delete", group?.id, {
    onSuccess: () => {
      toast("success", "탈퇴되었습니다.");
      resetGroupQuery();
    },
  });

  const handleQuit = () => {
    mutate();
    setIsSettingModal(false);
  };

  const menuArr: MenuProps[] = group
    ? [
        ...(isMember && !isAdmin
          ? [
              {
                text: "소모임 탈퇴하기",
                icon: <MemberOutIcon />,
                func: () => {
                  setIsSettingModal(true);
                },
              },
            ]
          : []),
        ...(isAdmin
          ? [
              {
                text: "모임 정보 수정",
                icon: <EditIcon />,
                func: () => {
                  setLocalStorageObj(GROUP_WRITING_STORE, {
                    ...group,
                  });
                  router.push(`/group/writing/main?id=${group.id}`);
                },
              },
              {
                text: "신청 인원 확인",
                icon: <MemberCheckIcon />,
                func: () => {
                  router.push(`/group/${group.id}/admin`);
                },
              },
              {
                text: "참여 인원 관리",
                icon: <MemberMinusIcon />,
                func: () => {
                  router.push(`/group/${group.id}/member`);
                },
              },
            ]
          : []),
        {
          kakaoOptions: {
            title: group?.title,
            subtitle: group?.guide,
            img: group?.image,
            url: "https://study-about.club" + router.asPath,
          },
        },
      ]
    : [];

  const alertOptions: IAlertModalOptions = {
    title: "소모임 탈퇴",
    subTitle: "소모임을 탈퇴하시겠어요?",
    text: "탈퇴",
    func: handleQuit,
  };

  return (
    <>
      <Header title="모임 정보" url="/group">
        <MenuButton menuArr={menuArr} />
      </Header>
      {isSettigModal && (
        <AlertModal options={alertOptions} setIsModal={setIsSettingModal} colorType="red" />
      )}
    </>
  );
}

function MemberOutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--color-gray)"
    >
      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240q17 0 28.5 11.5T480-800q0 17-11.5 28.5T440-760H200v560h240q17 0 28.5 11.5T480-160q0 17-11.5 28.5T440-120H200Zm487-320H400q-17 0-28.5-11.5T360-480q0-17 11.5-28.5T400-520h287l-75-75q-11-11-11-27t11-28q11-12 28-12.5t29 11.5l143 143q12 12 12 28t-12 28L669-309q-12 12-28.5 11.5T612-310q-11-12-10.5-28.5T613-366l74-74Z" />
    </svg>
  );
}

export default GroupHeader;
