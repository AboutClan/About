import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

import SuccessScreen from "../../components/layouts/SuccessScreen";
import { GROUP_WRITING_STORE } from "../../constants/keys/localStorage";
import { GROUP_STUDY } from "../../constants/keys/queryKeys";
import { useResetQueryData } from "../../hooks/custom/CustomHooks";
import { useErrorToast, useToast } from "../../hooks/custom/CustomToast";
import { useGroupWritingMutation } from "../../hooks/groupStudy/mutations";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { IGroup, IGroupWriting } from "../../types/models/groupTypes/group";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IGroupConfirmModal extends IModal {
  groupWriting: IGroupWriting;
}

function GroupConfirmModal({ setIsModal, groupWriting }: IGroupConfirmModal) {
  const router = useRouter();
  const errorToast = useErrorToast();
  const toast = useToast();

  const [isSuccessScreen, setIsSuccessScreen] = useState(false);
  console.log(setIsSuccessScreen);
  const resetQueryData = useResetQueryData();

  const resetLocalStorage = () => {
    localStorage.setItem(GROUP_WRITING_STORE, null);
  };

  const { mutate } = useGroupWritingMutation("post", {
    onSuccess() {
      resetQueryData([GROUP_STUDY]);
      resetLocalStorage();
      setIsSuccessScreen(true);
    },
    onError: errorToast,
  });

  const { mutate: updateGroup, isLoading } = useGroupWritingMutation("patch", {
    onSuccess() {
      resetLocalStorage();

      toast("success", "수정되었습니다.");
      resetQueryData([GROUP_STUDY], () => {
        router.push(`/group/${groupWriting.id}`);
      });
    },
    onError: errorToast,
  });

  const onSubmit = () => {
    if (groupWriting?.id) {
      updateGroup({ groupStudy: groupWriting as IGroup });
    } else mutate({ groupStudy: groupWriting });
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: groupWriting?.id ? "내용 수정" : "소모임 개설",
      func: onSubmit,
      isLoading,
    },
  };

  return (
    <>
      {groupWriting && (
        <ModalLayout
          title={groupWriting.id ? "내용 수정" : "소모임 개설"}
          setIsModal={setIsModal}
          footerOptions={footerOptions}
        >
          <ModalSubtitle>내용을 확인해 주세요!</ModalSubtitle>
          <Container>
            <Item>
              <span>제목:</span>
              <span>{groupWriting?.title}</span>
            </Item>
            <Item>
              <span>주제:</span>
              <span>{groupWriting.category.main}</span>
            </Item>
            <Item>
              <span>소개:</span>
              <span>{groupWriting?.guide}</span>
            </Item>
          </Container>
        </ModalLayout>
      )}
      {isSuccessScreen && (
        <SuccessScreen url="/group">
          <>
            <span>소모임 개설 성공</span>
            <div>운영진이 연락을 드릴테니, 기다려 주세요!</div>
          </>
        </SuccessScreen>
      )}
    </>
  );
}

const Container = styled.div`
  line-height: 2;
  font-size: 13px;
`;

const Item = styled.div`
  width: 100%;
  display: flex;
  > span:first-child {
    display: inline-block;
    width: 32px;
    font-weight: 600;
    margin-right: var(--gap-2);
  }
  > span:last-child {
    flex: 1;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-align: start;
    text-overflow: ellipsis;
  }
`;

export default GroupConfirmModal;
