import { useSession } from "next-auth/react";

import { useCompleteToast, useFailToast } from "../../hooks/custom/CustomToast";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

function RequestBirthModal({ setIsModal }: IModal) {
  const failToast = useFailToast();
  const completeToast = useCompleteToast();
  const { data: session } = useSession();

  const role = session?.user.role;

  const { mutate } = useUserRequestMutation({
    onSuccess() {
      completeToast("success");
      setIsModal(false);
    },
  });

  const onClick = () => {
    if (role === "human") {
      failToast("free", "정식 멤버만 신청 가능합니다.");
      return;
    }
    mutate({
      writer: session?.user.name,
      category: "건의",
      title: "생일 비공개 신청",
      content: session?.user?.uid as string,
    });
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "비공개",
    },
    sub: {
      text: "공개",
      func: onClick,
    },
  };

  return (
    <ModalLayout footerOptions={footerOptions} title="생일 공개 설정" setIsModal={setIsModal}>
      <ModalSubtitle>
        기본 설정으로 동아리원 생일에는 축하를 위해 멤버게시판에 프로필이 표시됩니다.
      </ModalSubtitle>
    </ModalLayout>
  );
}

export default RequestBirthModal;
