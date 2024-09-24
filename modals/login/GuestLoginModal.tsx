import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IGuestLoginModal extends IModal {
  customSignin: (type: "member" | "guest") => void;
}

function GuestLoginModal({ setIsModal, customSignin }: IGuestLoginModal) {
  const footerOptions: IFooterOptions = {
    main: {
      text: "게스트 로그인",
      func: () => customSignin("guest"),
    },
    sub: {
      text: "돌아가기",
    },
  };

  return (
    <>
      <ModalLayout title="게스트 로그인" setIsModal={setIsModal} footerOptions={footerOptions}>
        <ModalSubtitle>
          게스트용 로그인은 제한된 기능만을 제공합니다. 동아리 회원은 카카오 로그인으로 접속해
          주세요!
        </ModalSubtitle>
      </ModalLayout>
    </>
  );
}

export default GuestLoginModal;
