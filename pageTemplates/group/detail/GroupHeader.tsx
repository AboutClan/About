import { useRouter } from "next/router";
import { useState } from "react";
import MenuButton, { MenuProps } from "../../../components/atoms/buttons/MenuButton";

import Header from "../../../components/layouts/Header";
import { GROUP_STUDY_ALL } from "../../../constants/keys/queryKeys";
import { useResetQueryData } from "../../../hooks/custom/CustomHooks";
import { useCompleteToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { useGroupParticipationMutation } from "../../../hooks/groupStudy/mutations";
import { IGroup } from "../../../types/models/groupTypes/group";
import BottomDrawer from "../../profile/BottomDrawer";

interface IGroupHeader {
  group: IGroup;
}

function GroupHeader({ group }: IGroupHeader) {
  const completeToast = useCompleteToast();
  const router = useRouter();
  const typeToast = useTypeToast();

  const [isSettigModal, setIsSettingModal] = useState(false);

  const resetQueryData = useResetQueryData();

  // const onClick = () => {
  //   setLocalStorageObj(GROUP_WRITING_STORE, {
  //     ...group,
  //   });
  //   router.push(`/group/writing/main`);
  // };

  const movePage = async () => {
    completeToast("free", "탈퇴되었습니다.");
    await resetQueryData([GROUP_STUDY_ALL], () => {
      router.push("/group");
    });
  };

  const { mutate } = useGroupParticipationMutation("delete", group?.id, {
    onSuccess: movePage,
  });

  const handleQuit = () => {
    mutate();
  };

  const menuArr: MenuProps[] = [
    {
      text: "내용 수정하기",
      func: () => {},
    },
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

  return (
    <>
      <Header title={group?.title} rightPadding={6}>
        <MenuButton menuArr={menuArr} />
      </Header>
      {isSettigModal && (
        <BottomDrawer type="group" onClose={() => setIsSettingModal(false)} onSubmit={handleQuit} />
      )}
    </>
  );
}

export default GroupHeader;
