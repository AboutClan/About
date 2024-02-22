import { useSession } from "next-auth/react";
import styled from "styled-components";
import { IFooterOptions, ModalLayout } from "../../components/modals/Modals";
import { useCompleteToast, useFailToast } from "../../hooks/custom/CustomToast";
import { useStudyArrivedCntQuery } from "../../hooks/study/queries";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";

import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/reactTypes";

function RequestLevelUpModal({ setIsModal }: IModal) {
  const { data: session } = useSession();
  const completeToast = useCompleteToast();
  const failToast = useFailToast();

  const { data: studyArrivedCnt, isLoading } = useStudyArrivedCntQuery(
    session?.user.uid,
    {
      enabled: !!session,
    }
  );

  const { mutate: setRole } = useUserInfoFieldMutation("role", {
    onSuccess() {
      completeToast("free", "등업이 완료되었습니다.");
    },
  });

  const onClick = () => {
    if (isLoading) return;
    if (studyArrivedCnt >= 2) setRole({ role: "member" });
    else {
      failToast(
        "free",
        `현재 스터디에 ${studyArrivedCnt || 0}회 참여하였습니다.`
      );
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
    <ModalLayout
      title="등업 신청"
      footerOptions={footerOptions}
      setIsModal={setIsModal}
    >
      <ModalSubtitle>
        동아리원으로 등업을 신청합니다. 최소 2회 이상 스터디에 참여한 인원만
        가능합니다.
      </ModalSubtitle>
    </ModalLayout>
  );
}

const Layout = styled.div``;

export default RequestLevelUpModal;
