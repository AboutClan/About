import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";

import KakaoShareBtn from "../../../components/Icons/KakaoShareBtn";
import Header from "../../../components/layouts/Header";
import { GROUP_WRITING_STORE } from "../../../constants/keys/localStorage";
import { GROUP_STUDY_ALL } from "../../../constants/keys/queryKeys";
import { WEB_URL } from "../../../constants/system";
import { useResetQueryData } from "../../../hooks/custom/CustomHooks";
import { useCompleteToast } from "../../../hooks/custom/CustomToast";
import { useGroupParticipationMutation } from "../../../hooks/groupStudy/mutations";
import { IGroup } from "../../../types/models/groupTypes/group";
import { setLocalStorageObj } from "../../../utils/storageUtils";
import BottomDrawer from "../../profile/BottomDrawer";

interface IGroupHeader {
  group: IGroup;
}

function GroupHeader({ group }: IGroupHeader) {
  const completeToast = useCompleteToast();
  const router = useRouter();

  const organizer = group?.organizer;

  const { data: session } = useSession();

  const [isSettigModal, setIsSettingModal] = useState(false);

  const resetQueryData = useResetQueryData();

  const onClick = () => {
    setLocalStorageObj(GROUP_WRITING_STORE, {
      ...group,
    });
    router.push(`/group/writing/main`);
  };

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

  return (
    <>
      <Header title={group?.title} url="/group">
        <Flex>
          {session?.user.uid === organizer?.uid && (
            <IconWrapper onClick={onClick}>
              <i className="fa-light fa-pen-circle fa-xl" />
            </IconWrapper>
          )}
          <Wrapper>
            {group && (
              <KakaoShareBtn
                title={group.title}
                subtitle={group.guide}
                url={WEB_URL + `/group/${group.id}`}
                img={group?.image}
                type="gather"
                temp
              />
            )}
          </Wrapper>
          <IconWrapper onClick={() => setIsSettingModal(true)}>
            <i className="fa-light fa-gear fa-lg" />
          </IconWrapper>
        </Flex>
      </Header>
      {isSettigModal && (
        <BottomDrawer type="group" onClose={() => setIsSettingModal(false)} onSubmit={handleQuit} />
      )}
    </>
  );
}

const Wrapper = styled.div`
  width: 26px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-left: 16px;
`;

const IconWrapper = styled.button`
  width: 26px;
  height: 26px;
  display: flex;
  padding: 8px;
  justify-content: center;
  align-items: center;
  margin-left: var(--gap-3);
  margin-left: 16px;
`;

export default GroupHeader;
