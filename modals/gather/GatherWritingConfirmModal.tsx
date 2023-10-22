import dayjs from "dayjs";
import { useState } from "react";
import styled from "styled-components";
import {
  ModalBody,
  ModalFooterOne,
  ModalHeader,
  ModalLayout,
} from "../../components/modals/Modals";
import SuccessScreen from "../../components/pages/SuccessScreen";
import {
  useCompleteToast,
  useErrorToast,
  useFailToast,
} from "../../hooks/CustomToast";
import { useGatherContentMutation } from "../../hooks/gather/mutations";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IGatherWriting } from "../../types/page/gather";
import { IModal } from "../../types/reactTypes";

interface IGatherWritingConfirmModal extends IModal {
  gatherData: IGatherWriting;
}

function GatherWritingConfirmModal({
  setIsModal,
  gatherData,
}: IGatherWritingConfirmModal) {
  const completeToast = useCompleteToast();
  const errorToast = useErrorToast();
  const failToast = useFailToast();

  const [isSuccessScreen, setIsSuccessScreen] = useState(false);

  const { mutate } = useGatherContentMutation({
    onSuccess() {
      setIsSuccessScreen(true);
    },
    onError: errorToast,
  });

  const onSubmit = () => {
    mutate(gatherData);
  };

  return (
    <>
      <ModalLayout onClose={() => setIsModal(false)} size="md">
        <ModalHeader text="모임 개설" />
        <ModalBody>
          <ModalSubtitle>개설 내용을 확인해 주세요!</ModalSubtitle>
          <Container>
            <Item>
              <span>제목:</span>
              <span>{gatherData?.title}</span>
            </Item>
            <Item>
              <span>날짜:</span>
              <span>{dayjs(gatherData.date).format("M월 D일, H시 m분")}</span>
            </Item>
            <Item>
              <span>주제:</span>
              <span>{gatherData.type.subtitle}</span>
            </Item>
          </Container>
        </ModalBody>
        <ModalFooterOne isFull={true} text="모임 개설" onClick={onSubmit} />
      </ModalLayout>
      {isSuccessScreen && (
        <SuccessScreen url={`/gather`}>
          <>
            <span>모임 개최 성공</span>
            <div>모임 게시글을 오픈 채팅방에 공유해 주세요!</div>
          </>
        </SuccessScreen>
      )}
    </>
  );
}

const Container = styled.div`
  line-height: 1.8;
  font-size: 13px;
  color: var(--font-h2);
`;

const Item = styled.div`
  > span:first-child {
    font-weight: 600;
    margin-right: var(--margin-md);
  }
`;

export default GatherWritingConfirmModal;
