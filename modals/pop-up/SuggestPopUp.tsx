import { faLightbulbOn } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import styled from "styled-components";

import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";
import RequestSuggestModal from "../userRequest/RequestSuggestModal";

function SuggestPopUp({ setIsModal }: IModal) {
  const [isSuggestModal, setIsSuggestModal] = useState(false);

  const footerOptions: IFooterOptions = {
    main: {
      text: "건의하기",
      func: () => setIsSuggestModal(true),
    },
    sub: {},
  };

  return (
    <>
      <ModalLayout title="건의하기" footerOptions={footerOptions} setIsModal={setIsModal}>
        <ModalSubtitle>
          여러분의 건의사항을 기다리고 있어요! 어떤 의견이든 좋습니다. 매번
          <B> + 20 POINT</B>의 리워드를 드려요!
        </ModalSubtitle>
        <Wrapper>
          <FontAwesomeIcon icon={faLightbulbOn} size="3x" color="var(--color-red)" />
        </Wrapper>
      </ModalLayout>
      {isSuggestModal && <RequestSuggestModal setIsModal={setIsSuggestModal} type="suggest" />}
    </>
  );
}

const B = styled.span`
  color: var(--color-mint);
`;

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--gap-4);
`;

export default SuggestPopUp;
