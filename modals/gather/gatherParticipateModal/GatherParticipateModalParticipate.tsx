import { useRouter } from "next/router";

import { GATHER_CONTENT } from "../../../constants/keys/queryKeys";
import { POINT_SYSTEM_PLUS } from "../../../constants/serviceConstants/pointSystemConstants";
import { useResetQueryData } from "../../../hooks/custom/CustomHooks";
import { useCompleteToast, useErrorToast } from "../../../hooks/custom/CustomToast";
import { useGatherParticipationMutation } from "../../../hooks/gather/mutations";
import { usePointSystemMutation } from "../../../hooks/user/mutations";
import { IModal } from "../../../types/components/modalTypes";
import { ModalBodyNavTwo } from "../../Modals";

function GatherParticipateModalParticipate({ setIsModal }: IModal) {
  const completeToast = useCompleteToast();
  const errorToast = useErrorToast();

  const router = useRouter();
  const gatherId = +router.query.id;

  const resetQueryData = useResetQueryData();

  const { mutate: getScore } = usePointSystemMutation("score");

  const { mutate: participate } = useGatherParticipationMutation("post", gatherId, {
    onSuccess() {
      resetQueryData([GATHER_CONTENT]);
      getScore(POINT_SYSTEM_PLUS.GATHER_ATTEND);
      completeToast("free", "참여가 완료되었습니다. 5 SCORE 획득 !");
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
