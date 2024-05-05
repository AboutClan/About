import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { GATHER_CONTENT } from "../../../constants/keys/queryKeys";
import { useResetQueryData } from "../../../hooks/custom/CustomHooks";
import { useGatherQuery } from "../../../hooks/gather/queries";
import { IModal } from "../../../types/components/modalTypes";
import { ModalBodyNavTwo, ModalLayout } from "../../Modals";
import GatherExpireModalCancelDialog from "./GatherExpireModalCancelDialog";
import GatherExpireModalExpireDialog from "./GatherExpireModalExpireDialogs";

export type GatherExpireModalDialogType = "expire" | "cancel";

function GatherExpireModal({ setIsModal }: IModal) {
  const { id } = useParams<{ id: string }>() || {};
  const { data: gathers } = useGatherQuery();

  const gatherData = gathers?.find((item) => item.id + "" === id);

  const resetQueryData = useResetQueryData();
  const [modal, setModal] = useState<GatherExpireModalDialogType>();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isComplete) return;
    resetQueryData([GATHER_CONTENT]);
    setIsModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  return (
    <>
      <ModalLayout title="모집 종료" setIsModal={setIsModal}>
        <ModalBodyNavTwo
          topText="모집 마감"
          bottomText="모임 취소"
          onClickTop={() => setModal("expire")}
          onClickBottom={() => setModal("cancel")}
        />
      </ModalLayout>
      <GatherExpireModalExpireDialog setIsComplete={setIsComplete} modal={modal} />
      <GatherExpireModalCancelDialog
        setIsComplete={setIsComplete}
        modal={modal}
        isNoMember={gatherData.participants.length === 0}
      />
    </>
  );
}

export default GatherExpireModal;
