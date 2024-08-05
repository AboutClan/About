import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { useUserInfoQuery } from "../../../hooks/user/queries";
import RequestBirthModal from "../../../modals/userRequest/RequestBirthModal";
import RequestChargeDepositModal from "../../../modals/userRequest/RequestChargeDepositModal";
import RequestLevelUpModal from "../../../modals/userRequest/RequestLevelUpModal";
import RequestLogoutModal from "../../../modals/userRequest/RequestLogoutModal";
import RequestRestCancelModal from "../../../modals/userRequest/RequestRestCancelModal";
import RequestRestModal from "../../../modals/userRequest/RequestRestModal/RequestRestModal";
import RequestSecedeModal from "../../../modals/userRequest/RequestSecedeModal";
import RequestSuggestModal from "../../../modals/userRequest/RequestSuggestModal";
import StudyPresetModal from "../../../modals/userRequest/StudyPresetModal";
import { UserOverviewModal } from "./UserNavigation";

interface IUserNavigationModals {
  modalOpen: UserOverviewModal;
  setModalOpen: React.Dispatch<UserOverviewModal>;
}

function UserNavigationModals({ modalOpen, setModalOpen }: IUserNavigationModals) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPresetModal = !!searchParams.get("preset");
  const [isModal, setIsModal] = useState<boolean>();

  const { data: userInfo } = useUserInfoQuery();

  useEffect(() => {
    if (modalOpen === "spaceSetting") {
      router.replace("/user/setting?preset=on");
      setModalOpen(null);
      return;
    } else if (modalOpen) setIsModal(true);
    if (isModal === false) setModalOpen(null);
  }, [modalOpen, isModal]);

  return (
    <Layout>
      {modalOpen === "suggest" && <RequestSuggestModal type="suggest" setIsModal={setIsModal} />}
      {modalOpen === "studyPlace" && <RequestSuggestModal type="study" setIsModal={setIsModal} />}
      {modalOpen === "rest" &&
        (userInfo?.role !== "resting" ? (
          <RequestRestModal setIsModal={setIsModal} />
        ) : (
          <RequestRestCancelModal setIsModal={setIsModal} rest={userInfo?.rest} />
        ))}
      {modalOpen === "levelUp" && <RequestLevelUpModal setIsModal={setIsModal} />}
      {modalOpen === "declaration" && (
        <RequestSuggestModal type="declare" setIsModal={setIsModal} />
      )}
      {modalOpen === "deposit" && <RequestChargeDepositModal setIsModal={setIsModal} />}

      {modalOpen === "secede" && <RequestSecedeModal setIsModal={setIsModal} />}
      {isPresetModal && <StudyPresetModal />}

      {modalOpen === "profile" && <RequestBirthModal setIsModal={setIsModal} />}
      <RequestLogoutModal isModal={modalOpen === "logout"} setIsModal={setIsModal} />
    </Layout>
  );
}

const Layout = styled.div``;

export default UserNavigationModals;
