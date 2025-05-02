import { useState } from "react";

import { IModal } from "../../../types/components/modalTypes";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { ModalBodyNavTwo, ModalLayout } from "../../Modals";
import GatherExpireModalCancelDialog from "./GatherExpireModalCancelDialog";
import GatherExpireModalExpireDialog from "./GatherExpireModalExpireDialogs";

export type GatherExpireModalDialogType = "expire" | "cancel";

interface GatherExpireModalProps extends IModal {
  gather: IGather;
}

function GatherExpireModal({ setIsModal, gather }: GatherExpireModalProps) {
  const [modal, setModal] = useState<GatherExpireModalDialogType>();

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
      <GatherExpireModalExpireDialog modal={modal} />
      <GatherExpireModalCancelDialog modal={modal} isNoMember={gather.participants.length === 0} />
    </>
  );
}

export default GatherExpireModal;
