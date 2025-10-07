import { useRouter } from "next/router";
import { useQueryClient } from "react-query";

import AlertModal, { IAlertModalOptions } from "../../../components/AlertModal";
import { GATHER_CONTENT } from "../../../constants/keys/queryKeys";
import { useErrorToast, useToast } from "../../../hooks/custom/CustomToast";
import { useGatherStatusMutation } from "../../../hooks/gather/mutations";
import { IModal } from "../../../types/components/modalTypes";

interface IGatherExpireModalExpireDialog extends IModal {}

function GatherExpireModalExpireDialog({ setIsModal }: IGatherExpireModalExpireDialog) {
  const toast = useToast();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();

  const router = useRouter();

  const gatherId = +router.query.id;

  const { mutate: statusOpen } = useGatherStatusMutation(gatherId, {
    onSuccess() {
      setIsModal(false);
      queryClient.invalidateQueries({ queryKey: [GATHER_CONTENT], exact: false });
      toast("success", "모임이 확정되었어요!");
    },
    onError: errorToast,
  });

  const onComplete = () => {
    statusOpen("open");
  };

  const alertModalOptions: IAlertModalOptions = {
    title: "모임 확정",
    subTitle: "현재 인원으로 모임을 확정하시겠어요?",
    func: onComplete,
    text: "확 정",
  };

  return <AlertModal options={alertModalOptions} colorType="mint" setIsModal={setIsModal} />;
}

export default GatherExpireModalExpireDialog;
