import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";

import AlertModal, { IAlertModalOptions } from "../../../components/AlertModal";
import MenuButton, { MenuProps } from "../../../components/atoms/buttons/MenuButton";
import Header from "../../../components/layouts/Header";
import { GROUP_WRITING_STORE } from "../../../constants/keys/localStorage";
import { GROUP_STUDY } from "../../../constants/keys/queryKeys";
import { useCompleteToast } from "../../../hooks/custom/CustomToast";
import { useGroupParticipationMutation } from "../../../hooks/groupStudy/mutations";
import { transferGroupDataState } from "../../../recoils/transferRecoils";
import { IGroup } from "../../../types/models/groupTypes/group";
import { setLocalStorageObj } from "../../../utils/storageUtils";

interface IGroupHeader {
  group: IGroup;
}

function GroupHeader({ group }: IGroupHeader) {
  const { data: session } = useSession();
  const completeToast = useCompleteToast();
  const router = useRouter();
  const isAdmin = group.organizer.uid === session?.user.uid;
  const isMember =
    session?.user.uid === "2259633694" ||
    group.participants.some((par) => par.user?.uid === session?.user.uid);

  const [isSettigModal, setIsSettingModal] = useState(false);
  const setTransferGroup = useSetRecoilState(transferGroupDataState);

  const queryClient = useQueryClient();
  const movePage = async () => {
    completeToast("free", "탈퇴되었습니다.");
    queryClient.invalidateQueries({ queryKey: [GROUP_STUDY], exact: false });
    setTransferGroup(null);
    router.push("/group");
  };

  const { mutate } = useGroupParticipationMutation("delete", group?.id, {
    onSuccess: movePage,
  });

  const handleQuit = () => {
    mutate();
  };

  const menuArr: MenuProps[] = [
    ...(isMember
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
