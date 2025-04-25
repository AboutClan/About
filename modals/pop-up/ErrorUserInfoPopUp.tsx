import { signOut, useSession } from "next-auth/react";

import { useCompleteToast } from "../../hooks/custom/CustomToast";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

function ErrorUserInfoPopUp({ setIsModal }: IModal) {
  const { data: session } = useSession();
  const completeToast = useCompleteToast();

  const { mutate: sendRequest } = useUserRequestMutation({
    onSuccess() {
      completeToast("free", "전송이 완료되었습니다.");
      logout();
    },
  });

  const logout = () => {
    signOut({ callbackUrl: "/login" });
    setIsModal(false);
  };

  const sendError = () => {
    sendRequest({
      title: "유저 정보 에러",
      category: "건의",
      content: `에러 id: ${session.user.id}`,
    });
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "오류 전송",
      func: sendError,
    },
    sub: {
      text: "로그아웃",
      func: logout,
    },
  };

  return (
    <ModalLayout setIsModal={setIsModal} title="유저 정보 오류" footerOptions={footerOptions}>
      <ModalSubtitle>
        유저 정보에 오류가 있어 이용이 불가능합니다. 재접속을 한 뒤에도 같은 오류가 발생하면 오류
        전송을 눌러주세요! 관리자에게 별도로 말씀해주시면 더 빠른 처리가 가능합니다.
      </ModalSubtitle>
    </ModalLayout>
  );
}

export default ErrorUserInfoPopUp;
