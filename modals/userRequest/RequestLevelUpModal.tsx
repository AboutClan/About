import { useSession } from "next-auth/react";

import { useFailToast, useToast } from "../../hooks/custom/CustomToast";
import { useStudyArrivedCntQuery } from "../../hooks/study/queries";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

function RequestLevelUpModal({ setIsModal }: IModal) {
  const { data: session } = useSession();
  const toast = useToast();
  const failToast = useFailToast();

  const { data: studyArrivedCnt, isLoading } = useStudyArrivedCntQuery(session?.user.uid, {
    enabled: !!session,
  });

  const { mutate: setRole } = useUserInfoFieldMutation("role", {
    onSuccess() {
      toast("success", "등업이 완료되었습니다.");
    },
  });

  const onClick = () => {
    if (isLoading) return;
    if (studyArrivedCnt >= 2) setRole({ role: "member" });
    else {
      failToast("free", `현재 스터디에 ${studyArrivedCnt || 0}회 참여하였습니다.`);
      setIsModal(false);
    }
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "등업 신청",
      func: onClick,
    },
    sub: {},
  };

  return (
    <ModalLayout title="등업 신청" footerOptions={footerOptions} setIsModal={setIsModal}>
      <ModalSubtitle>
        동아리원으로 등업을 신청합니다. 최소 2회 이상 스터디에 참여한 인원만 가능합니다.
      </ModalSubtitle>
    </ModalLayout>
  );
}

export default RequestLevelUpModal;
