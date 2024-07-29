import { useSession } from "next-auth/react";

import { useCompleteToast } from "../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

function RequestBirthModal({ setIsModal }: IModal) {
  const completeToast = useCompleteToast();
  const { data: session } = useSession();

  const { mutate } = useUserInfoFieldMutation("isPrivate", {
    onSuccess() {
      completeToast("success");
      setIsModal(false);
    },
  });

  const footerOptions: IFooterOptions = {
    main: {
      text: "비공개",
      func: () => mutate({ isPrivate: true }),
    },
    sub: {
      text: "공개",
      func: () => mutate({ isPrivate: false }),
    },
  };

  return (
    <ModalLayout footerOptions={footerOptions} title="프로필 공개 설정" setIsModal={setIsModal}>
      <ModalSubtitle>
        친구로 등록된 인원을 제외하고 {session?.user.name}님의 프로필을 확인할 수 없습니다.
      </ModalSubtitle>
    </ModalLayout>
  );
}

export default RequestBirthModal;
