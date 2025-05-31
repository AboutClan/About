import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IGuestLoginModal extends IModal {
  customSignin: (type: "member" | "guest") => void;
}

function GuestLoginModal({ setIsModal, customSignin }: IGuestLoginModal) {
  const footerOptions: IFooterOptions = {
    main: {
      text: "게스트로 구경하기",
      func: () => customSignin("guest"),
    },
    sub: {
      text: "닫 기",
    },
  };

  return (
    <>
      <ModalLayout title="게스트 로그인" setIsModal={setIsModal} footerOptions={footerOptions}>
        <span>
          <b>게스트 로그인</b>은 일부 제한된 기능만 제공합니다. 천천히 둘러보신 후, 가입 신청은{" "}
          <b>카카오 로그인</b>을 이용해 주세요!
        </span>
      </ModalLayout>
    </>
  );
}

export default GuestLoginModal;
