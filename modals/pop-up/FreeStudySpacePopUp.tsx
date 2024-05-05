import { faLightbulbOn } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import styled from "styled-components";

import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import ModalPortal from "../ModalPortal";
import { IFooterOptions, ModalLayout } from "../Modals";
import RequestSuggestModal from "../userRequest/RequestSuggestModal";

function FreestudyPopUp({ setIsModal }: IModal) {
  const [isSuggestModal, setIsSuggestModal] = useState(false);

  const footerOptions: IFooterOptions = {
    main: {
      text: "장소 추천",
      func: () => setIsSuggestModal(true),
    },
    sub: {
      text: "닫기",
      func: () => setIsModal(false),
    },
  };
  return (
    <>
      <ModalLayout title="스터디 장소 추천" setIsModal={setIsModal} footerOptions={footerOptions}>
        <ModalSubtitle>
          같이 카공하기 좋은 스터디 장소 추천을 받습니다! 혼자 알고 있는 카페가 있다면 공유해주세요!{" "}
          <span style={{ color: "var(--color-mint)" }}>(+10 point)</span>
        </ModalSubtitle>
        <Wrapper>
          <FontAwesomeIcon icon={faLightbulbOn} size="3x" color="var(--color-red)" />
        </Wrapper>
      </ModalLayout>
      {isSuggestModal && (
        <ModalPortal setIsModal={setIsModal}>
          <RequestSuggestModal setIsModal={setIsModal} type="study" />
        </ModalPortal>
      )}
    </>
  );
}

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default FreestudyPopUp;
