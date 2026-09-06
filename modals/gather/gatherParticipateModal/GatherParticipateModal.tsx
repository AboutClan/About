import { useState } from "react";

import GatherParticipateModalApply from "@/modals/gather/gatherParticipateModal/GatherParticipateModalApply";
import GatherParticipateModalParticipate from "@/modals/gather/gatherParticipateModal/GatherParticipateModalParticipate";
import GatherParticipateModalPassword from "@/modals/gather/gatherParticipateModal/GatherParticipateModalPassword";
import { ModalLayout } from "@/modals/Modals";
import { IModal } from "@/types/components/modalTypes";
import { IGather } from "@/types/models/gatherTypes/gatherTypes";

interface GatherParticipateModalProps extends IModal {
  gather: IGather;
}

function GatherParticipateModal({ setIsModal, gather }: GatherParticipateModalProps) {
  const [pageNum, setPageNum] = useState(0);

  return (
    <ModalLayout title="참여 신청" setIsModal={setIsModal}>
      <>
        {pageNum === 0 ? (
          <GatherParticipateModalApply gather={gather} setPageNum={setPageNum} />
        ) : pageNum === 1 ? (
          <GatherParticipateModalPassword gather={gather} setPageNum={setPageNum} />
        ) : (
          <GatherParticipateModalParticipate setIsModal={setIsModal} />
        )}
      </>
    </ModalLayout>
  );
}

export default GatherParticipateModal;
