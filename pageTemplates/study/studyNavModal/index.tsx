import { useState } from "react";
import styled from "styled-components";
import ModalPortal from "../../../../components/modals/ModalPortal";
import StudyAbsentModal from "../../../../modals/study/StudyAbsentModal";
import StudyChangeTimeModal from "../../../../modals/study/StudyChangeTimeModal";
import StudyCheckImageModal from "../../../../modals/study/StudyCheckImageModal";
import StudyCheckModal from "../../../../modals/study/StudyCheckModal";
import StudyFreeOpenModal from "../../../../modals/study/StudyFreeOpenModal";
import StudyLightAbsentModal from "../../../../modals/study/StudyLightAbsentModal";
import StudyVoteSubModal from "../../../../modals/study/studyVoteSubModal/StudyVoteSubModal";
import { DispatchType } from "../../../../types/reactTypes";
import { IAttendance, IPlace } from "../../../../types/study/studyDetail";
import { studyModalType } from "../StudyNavigation";
import VoteSuccessScreen from "../VoteSuccessScreen";

interface IstudyNavModal {
  type: studyModalType;
  setType: DispatchType<studyModalType>;
  myVote: IAttendance;
  place: IPlace;
  attCnt: number;
}

function studyNavModal({
  type,
  setType,
  myVote,
  place,
  attCnt,
}: IstudyNavModal) {
  const [isVoteComplete, setIsVoteComplete] = useState(false);

  const closeModal = () => {
    setType(null);
  };

  return (
    <Layout>
      {["vote", "private"].includes(type) && (
        <ModalPortal setIsModal={closeModal}>
          <StudyVoteSubModal
            setIsModal={closeModal}
            place={place}
            isPrivate={type === "private"}
            attCnt={attCnt}
          />
        </ModalPortal>
      )}
      {type === "freeOpen" && (
        <StudyFreeOpenModal place={place} setIsModal={closeModal} />
      )}
      {type === "attendCheck" && <StudyCheckModal setIsModal={closeModal} />}
      {type === "attendCheckImage" && (
        <StudyCheckImageModal setIsModal={closeModal} />
      )}
      {type === "change" && (
        <StudyChangeTimeModal
          setIsModal={closeModal}
          myVoteTime={myVote?.time}
        />
      )}
      {type === "absent" && <StudyAbsentModal setIsModal={closeModal} />}
      {type === "lightAbsent" && (
        <StudyLightAbsentModal setIsModal={closeModal} />
      )}
      {isVoteComplete && (
        <ModalPortal setIsModal={setIsVoteComplete}>
          <VoteSuccessScreen />
        </ModalPortal>
      )}
    </Layout>
  );
}

const Layout = styled.div``;

export default studyNavModal;
