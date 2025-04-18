import { Box } from "@chakra-ui/react";

import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

interface StudyOpenCheckModalProps extends IModal {
  handleButton: () => void;
}

function StudyOpenCheckModal({ setIsModal, handleButton }: StudyOpenCheckModalProps) {
  const footerOptions: IFooterOptions = {
    main: {
      text: "좋아요 !",
      func: () => {
        handleButton();
        setIsModal(false);
      },
    },
    sub: {
      text: "닫 기",
      func: () => {
        setIsModal(false);
      },
    },
  };

  return (
    <ModalLayout footerOptions={footerOptions} setIsModal={setIsModal} title="스터디 매칭 실패">
      <Box textAlign="start">
        가까운 위치의 신청자가 없어 매칭이 실패했어요.
        <br /> <b>개설된 스터디</b>에 참여하거나,
        <br />
        <b>일일 스터디</b>를 열어보는 건 어떨까요?
      </Box>
    </ModalLayout>
  );
}

export default StudyOpenCheckModal;
