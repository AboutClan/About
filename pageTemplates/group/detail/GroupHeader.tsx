import { Flex } from "@chakra-ui/react";
import { faGear, faPenCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import KakaoShareBtn from "../../../components/atoms/Icons/KakaoShareBtn";
import Header from "../../../components/layouts/Header";
import { GROUP_STUDY_ALL } from "../../../constants/keys/queryKeys";
import { WEB_URL } from "../../../constants/system";
import { useResetQueryData } from "../../../hooks/custom/CustomHooks";
import { useCompleteToast } from "../../../hooks/custom/CustomToast";
import { useGroupParticipationMutation } from "../../../hooks/groupStudy/mutations";
import { sharedGroupWritingState } from "../../../recoils/sharedDataAtoms";
import { IGroup } from "../../../types/models/groupTypes/group";
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

  const setGroupWriting = useSetRecoilState(sharedGroupWritingState);

  const resetQueryData = useResetQueryData();

  const onClick = () => {
    setGroupWriting(group);

    router.push("/group/writing/main");
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
      <Header title="소모임" url="/group">
        <Flex>
          {session?.user.uid === organizer?.uid && (
            <IconWrapper onClick={onClick}>
              <FontAwesomeIcon icon={faPenCircle} size="xl" />
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
              />
            )}
          </Wrapper>
          <IconWrapper onClick={() => setIsSettingModal(true)}>
            <FontAwesomeIcon icon={faGear} size="lg" />
          </IconWrapper>
        </Flex>
      </Header>

      <BottomDrawer
        type="group"
        isModal={isSettigModal}
        setIsModal={setIsSettingModal}
        onSubmit={handleQuit}
      />

      {/* {isModal && (
        <GroupKakaoShareModal
          setIsModal={setIsModal}
          title={title}
          date={date}
          locationMain={locationMain}
        />
      )} */}
    </>
  );
}

const Wrapper = styled.div`
  width: 26px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: var(--gap-3);
`;

const IconWrapper = styled.button`
  width: 26px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: var(--gap-3);
`;

export default GroupHeader;
