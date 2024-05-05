import { useRouter } from "next/router";

import { GATHER_CONTENT } from "../../../constants/keys/queryKeys";
import { useResetQueryData } from "../../../hooks/custom/CustomHooks";
import { useCompleteToast, useErrorToast } from "../../../hooks/custom/CustomToast";
import { useGatherParticipationMutation } from "../../../hooks/gather/mutations";
import { IModal } from "../../../types/components/modalTypes";
import { ModalBodyNavTwo } from "../../Modals";

function GatherParticipateModalParticipate({ setIsModal }: IModal) {
  const completeToast = useCompleteToast();
  const errorToast = useErrorToast();

  const router = useRouter();
  const gatherId = +router.query.id;

  const resetQueryData = useResetQueryData();
  const { mutate: participate } = useGatherParticipationMutation("post", gatherId, {
    onSuccess() {
      resetQueryData([GATHER_CONTENT]);

      completeToast("free", "참여 완료!");
    },
    onError: errorToast,
  });

  const selectGatherTime = (phase: "first" | "second") => {
    participate({ phase });
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
