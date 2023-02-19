import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useContext } from "react";
import CancelModal from "../modals/CancelModal";
import NotCompletedModal from "../modals/NotCompletedModal";
import UserInfoForm from "../modals/RegisterFormModal";
import {
  isShowNotCompletedState,
  isShowOpenResultState,
  isShowPrivacyPolicyState,
  isShowRegisterFormState,
  isShowStudyVoteModalState,
  isShowVoteCancleState,
  isShowVoterState,
  modalContextState,
} from "../recoil/atoms";
import OpenResultModal from "../modals/OpenResultModal";
import ModalPortal from "../libs/utils/ModalPortal";
import VoterModal from "../modals/VoterModal";
import StudyVoteModal from "../modals/StudyVoteModal";
import RegisterFormModal from "../modals/RegisterFormModal";
import { PrivacyPolicy } from "../storage/PrivacyPolicy";
import { useSession } from "next-auth/react";

function Modals() {
  const { data: session } = useSession();
  const isShowVoteCancel = useRecoilValue(isShowVoteCancleState);
  const isShowNotCompleted = useRecoilValue(isShowNotCompletedState);
  const isShowRegisterForm = useRecoilValue(isShowRegisterFormState);
  const [isShowVoter, setIsShowVoter] = useRecoilState(isShowVoterState);
  const isShowOpenResult = useRecoilValue(isShowOpenResultState);
  const isShowStudyVote = useRecoilValue(isShowStudyVoteModalState);
  const isShowPrivacyPolicy = useRecoilValue(isShowPrivacyPolicyState);
  const setModalContext = useSetRecoilState(modalContextState);

  const isMember = false;

  return (
    <>
      {isShowPrivacyPolicy && <PrivacyPolicy />}
      {isShowVoteCancel && <CancelModal />}
      {isShowNotCompleted && <NotCompletedModal />}

      {isShowOpenResult && <OpenResultModal />}
      {isShowStudyVote && <StudyVoteModal />}
      {isShowVoter && (
        <ModalPortal
          closePortal={setIsShowVoter}
          setModalContext={setModalContext}
        >
          <VoterModal />
        </ModalPortal>
      )}
      {!isShowRegisterForm && <RegisterFormModal />}
    </>
  );
}
export default Modals;
