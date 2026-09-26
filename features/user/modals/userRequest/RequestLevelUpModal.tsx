import { IFooterOptions, ModalLayout } from "@/components/modals/Modals";
import { useUserInfoFieldMutation } from "@/features/user/hooks/mutations";
import { useUserInfoQuery } from "@/features/user/hooks/queries";
import { useFailToast, useToast } from "@/hooks/custom/CustomToast";
import { ModalSubtitle } from "@/styles/layout/modal";
import { IModal } from "@/types/components/modalTypes";

/** 등업에 필요한 최소 스터디 참여 횟수. */
const REQUIRED_ATTEND_CNT = 2;

function RequestLevelUpModal({ setIsModal }: IModal) {
  const toast = useToast();
  const failToast = useFailToast();

  // 예전에는 `GET /vote/arriveCnt`로 횟수를 받아왔는데 백엔드에 해당 컨트롤러가 없어
  // 요청이 항상 실패했고, data가 undefined라 `undefined >= 2`가 언제나 false가 되어
  // 등업 신청이 아무도 통과하지 못했다. 출석 시 누적되는 studyRecord를 직접 쓴다.
  const { data: userInfo, isLoading } = useUserInfoQuery();

  const studyAttendCnt = userInfo?.studyRecord?.accumulationCnt ?? 0;

  const { mutate: setRole } = useUserInfoFieldMutation("role", {
    onSuccess() {
      toast("success", "등업이 완료되었습니다.");
    },
  });

  const onClick = () => {
    if (isLoading) return;
    if (studyAttendCnt >= REQUIRED_ATTEND_CNT) setRole({ role: "member" });
    else {
      failToast("free", `현재 스터디에 ${studyAttendCnt}회 참여하였습니다.`);
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
        동아리원으로 등업을 신청합니다. 최소 {REQUIRED_ATTEND_CNT}회 이상 스터디에 참여한 인원만
        가능합니다.
      </ModalSubtitle>
    </ModalLayout>
  );
}

export default RequestLevelUpModal;
