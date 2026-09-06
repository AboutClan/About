import { useState } from "react";

import GatherExpireModalCancelDialog from "@/modals/gather/gatherExpireModal/GatherExpireModalCancelDialog";
import GatherExpireModalExpireDialog from "@/modals/gather/gatherExpireModal/GatherExpireModalExpireDialogs";
import { ModalLayout } from "@/modals/Modals";
import { IModal } from "@/types/components/modalTypes";
import { IGather } from "@/types/models/gatherTypes/gatherTypes";

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
        <GatherExpireModalExpireDialog
          setIsModal={() => {
            setIsModal(false);
            setModal(null);
          }}
        />
      ) : modal === "cancel" ? (
        <GatherExpireModalCancelDialog
          memberCnt={gather.participants.length}
          setIsModal={setIsModal}
        />
      ) : null}
    </>
  );
}

export default GatherExpireModal;
