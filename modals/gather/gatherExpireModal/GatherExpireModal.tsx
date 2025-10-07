import { useState } from "react";

import { IModal } from "../../../types/components/modalTypes";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { ModalLayout } from "../../Modals";
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
      <ModalLayout
        title="모집 종료"
        setIsModal={setIsModal}
        footerOptions={{
          main: { text: "모임 확정", func: () => setModal("expire") },
          sub: { text: "모임 취소", func: () => setModal("cancel") },
        }}
      >
        모임 진행 여부를 선택해 주세요!
        {/* <ModalBodyNavTwo
          topText="모임 확정"
          bottomText="모임 개설 취소"
          onClickTop={() => setModal("expire")}
          onClickBottom={() => setModal("cancel")}
        /> */}
      </ModalLayout>
      {modal === "expire" ? (
        <GatherExpireModalExpireDialog setIsModal={() => setModal(null)} />
      ) : modal === "cancel" ? (
        <GatherExpireModalCancelDialog
          modal={modal}
          memberCnt={gather.participants.length}
          setIsModal={setIsModal}
        />
      ) : null}
    </>
  );
}

export default GatherExpireModal;
