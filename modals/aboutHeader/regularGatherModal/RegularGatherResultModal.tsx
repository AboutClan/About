/* eslint-disable */

import { useRouter } from "next/router";
import { useEffect } from "react";
import styled from "styled-components";

import { RABBIT_RUN } from "../../../constants/keys/localStorage";
import { IModal } from "../../../types/components/modalTypes";
import { DispatchBoolean } from "../../../types/hooks/reactTypes";

interface IRegularGatherResultModal extends IModal {
  setIsRabbitRun: DispatchBoolean;
}

function RegularGatherResultModal({ setIsModal, setIsRabbitRun }: IRegularGatherResultModal) {
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem(RABBIT_RUN, "read");
  }, []);

  const onClick = () => {
    router.push(`/checkGather`);
  };

  return null;
  // <ModalLayout onClose={() => setIsModal(false)} size="md">
  //   <ModalHeader text="조모임 신청 결과" />
  //   <ModalBody>
  //     <b>조모임 신청 결과가 나왔어요!</b> 너무 슬프지만 조건에 맞는 조편성이
  //     불가능하여 어쩔 수 없이 매칭에 실패한 인원도 있습니다... 😂
  //     <IconWrapper>
  //       <FontAwesomeIcon icon={faFaceSurprise} size="2x" />
  //       <FontAwesomeIcon icon={faFaceSurprise} size="2x" />
  //       <FontAwesomeIcon icon={faFaceSurprise} size="2x" />
  //     </IconWrapper>
  //   </ModalBody>
  //   <ModalFooterTwo
  //     leftText="닫기"
  //     rightText="확인하러가기"
  //     onClickLeft={() => setIsModal(false)}
  //     onClickRight={onClick}
  //     isFull={true}
  //   />
  // </ModalLayout>
}

const IconWrapper = styled.div`
  margin-top: var(--gap-2);
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  > * {
    color: var(--gray-400);
    margin-right: var(--gap-1);
  }
`;

export default RegularGatherResultModal;
