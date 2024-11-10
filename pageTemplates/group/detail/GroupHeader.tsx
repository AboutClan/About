import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";

import AlertModal, { IAlertModalOptions } from "../../../components/AlertModal";
import MenuButton, { MenuProps } from "../../../components/atoms/buttons/MenuButton";
import Header from "../../../components/layouts/Header";
import { GROUP_WRITING_STORE } from "../../../constants/keys/localStorage";
import { useResetGroupQuery } from "../../../hooks/custom/CustomHooks";
import { useCompleteToast } from "../../../hooks/custom/CustomToast";
import { useGroupParticipationMutation } from "../../../hooks/groupStudy/mutations";
import { IGroup } from "../../../types/models/groupTypes/group";
import { setLocalStorageObj } from "../../../utils/storageUtils";

interface IGroupHeader {
  group: IGroup;
}

function GroupHeader({ group }: IGroupHeader) {
  const { data: session } = useSession();
  const resetGroupQuery = useResetGroupQuery();
  const completeToast = useCompleteToast();
  const router = useRouter();
  const isAdmin = group.organizer.uid === session?.user.uid;
  const isMember =
    session?.user.uid === "2259633694" ||
    group.participants.some((par) => par.user?.uid === session?.user.uid);

  const [isSettigModal, setIsSettingModal] = useState(false);

  const movePage = async () => {
    completeToast("free", "탈퇴되었습니다.");
    resetGroupQuery();
  };

  const { mutate } = useGroupParticipationMutation("delete", group?.id, {
    onSuccess: movePage,
  });

  const handleQuit = () => {
    mutate();
  };

  const menuArr: MenuProps[] = [
    ...(isMember && !isAdmin
      ? [
          {
            text: "소모임 탈퇴하기",
            func: () => {
              setIsSettingModal(true);
            },
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            text: "관리자 페이지",
            func: () => {
              router.push(`/group/${group.id}/admin`);
            },
          },
          {
            text: "인원 관리",
            func: () => {
              router.push(`/group/${group.id}/member`);
            },
          },
          {
            text: "내용 수정하기",
            func: () => {
              setLocalStorageObj(GROUP_WRITING_STORE, {
                ...group,
              });
              router.push(`/group/writing/main`);
            },
          },
        ]
      : []),
    {
      kakaoOptions: {
        type: "study",
        title: group.title,
        subtitle: group.category.main,
        img: group.image,
        url: `/group/${group.id}`,
      },
    },
  ];

  const alertOptions: IAlertModalOptions = {
    title: "소모임 탈퇴",
    subTitle: "소모임을 탈퇴하시겠어요?",
    text: "탈퇴",
    func: handleQuit,
  };

  return (
    <>
      <Header title="모임 정보" rightPadding={6} isCenter>
        <MenuButton menuArr={menuArr} />
      </Header>
      {isSettigModal && (
        <AlertModal options={alertOptions} setIsModal={setIsSettingModal} colorType="red" />
      )}
    </>
  );
}

export default GroupHeader;
