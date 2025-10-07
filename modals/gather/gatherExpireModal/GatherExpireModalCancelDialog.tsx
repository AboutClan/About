import { useRouter } from "next/router";
import { useQueryClient } from "react-query";

import AlertModal, { IAlertModalOptions } from "../../../components/AlertModal";
import { GATHER_CONTENT } from "../../../constants/keys/queryKeys";
import { useErrorToast, useToast } from "../../../hooks/custom/CustomToast";
import { useGatherStatusMutation, useGatherWritingMutation } from "../../../hooks/gather/mutations";
import { IModal } from "../../../types/components/modalTypes";

interface IGatherExpireModalCancelDialog extends IModal {
  memberCnt: number;
}

function GatherExpireModalCancelDialog({
  memberCnt,

  setIsModal,
}: IGatherExpireModalCancelDialog) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const errorToast = useErrorToast();

  const router = useRouter();

  const gatherId = +router.query.id;

  const onComplete = async (type: "delete" | "close") => {
    queryClient.removeQueries({ queryKey: [GATHER_CONTENT], exact: false });

    if (type === "delete") {
      toast("success", "모임이 삭제되었습니다.");
      router.push(`/gather`);
    }
    if (type === "close") toast("success", "모임이 취소되었습니다.");
    setIsModal(false);
  };

  const { mutate: gatherDelete } = useGatherWritingMutation("delete", {
    onSuccess: () => onComplete("delete"),
    onError: errorToast,
  });
  const { mutate: statusClose } = useGatherStatusMutation(gatherId, {
    onSuccess: () => onComplete("close"),
    onError: errorToast,
  });

  const onCancel = () => {
    if (memberCnt <= 3) gatherDelete({ gatherId });
    else statusClose("close");
  };

  const alertModalOptions: IAlertModalOptions = {
    title: "모임 취소",
    subTitle:
      memberCnt <= 3
        ? "개설을 취소하시겠어요? 참여자가 부족해 모임이 완전히 삭제됩니다."
        : "모임을 취소하시겠어요? 3명 이상의 참여자가 있어 취소 상태로 변경됩니다.",
    func: onCancel,
    text: "모임 취소",
    defaultText: "닫 기",
  };

  return <AlertModal options={alertModalOptions} setIsModal={setIsModal} />;
}

export default GatherExpireModalCancelDialog;
