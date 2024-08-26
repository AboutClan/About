import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { useRecoilState } from "recoil";

import { GATHER_CONTENT } from "../../../constants/keys/queryKeys";
import { useCompleteToast, useErrorToast } from "../../../hooks/custom/CustomToast";
import {
  useGatherParticipationMutation,
  useGatherWaitingMutation,
} from "../../../hooks/gather/mutations";
import { transferGatherDataState } from "../../../recoils/transferRecoils";
import { IModal } from "../../../types/components/modalTypes";
import { ModalBodyNavTwo } from "../../Modals";

function GatherParticipateModalParticipate({ setIsModal }: IModal) {
  const queryClient = useQueryClient();
  const completeToast = useCompleteToast();
  const errorToast = useErrorToast();
  const [transferGather, setTransferGather] = useRecoilState(transferGatherDataState);

  const router = useRouter();
  const gatherId = +router.query.id;

  const { mutate: participate } = useGatherParticipationMutation("post", gatherId, {
    onSuccess() {
      queryClient.invalidateQueries([GATHER_CONTENT, gatherId]);
      setTransferGather(null);
      completeToast("free", "참여가 완료되었습니다. 5 SCORE 획득 !");
    },
    onError: errorToast,
  });
  const { mutate: applyWaiting } = useGatherWaitingMutation(gatherId, {
    onSuccess() {
      queryClient.invalidateQueries([GATHER_CONTENT, gatherId]);
      setTransferGather(null);
      completeToast("free", "참여가 완료되었습니다. 5 SCORE 획득 !");
    },
    onError: errorToast,
  });

  const selectGatherTime = (phase: "first" | "second") => {
    const isApproval = transferGather?.isApprovalRequired;
    if (isApproval) applyWaiting({ phase });
    else participate({ phase });
    setIsModal(false);
  };

  return (
    <ModalBodyNavTwo
      topText="1차 참여 신청"
      bottomText="2차 참여 신청"
      onClickTop={() => selectGatherTime("first")}
      onClickBottom={() => selectGatherTime("second")}
    />
  );
}

export default GatherParticipateModalParticipate;
