import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";

import RightDrawer from "../../../components/organisms/drawer/RightDrawer";
import { USER_INFO } from "../../../constants/keys/queryKeys";
import { useTypeToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../../hooks/user/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import RequestBirthModal from "../../../modals/userRequest/RequestBirthModal";
import RequestChargeDepositModal from "../../../modals/userRequest/RequestChargeDepositModal";
import RequestLevelUpModal from "../../../modals/userRequest/RequestLevelUpModal";
import RequestLogoutModal from "../../../modals/userRequest/RequestLogoutModal";
import RequestRestCancelModal from "../../../modals/userRequest/RequestRestCancelModal";
import RequestRestModal from "../../../modals/userRequest/RequestRestModal/RequestRestModal";
import RequestSecedeModal from "../../../modals/userRequest/RequestSecedeModal";
import RequestSuggestModal from "../../../modals/userRequest/RequestSuggestModal";
import { RegisterLocationLayout } from "../../../pages/register/location";
import { KakaoLocationProps } from "../../../types/externals/kakaoLocationSearch";
import { UserOverviewModal } from "./UserNavigation";

interface IUserNavigationModals {
  modalOpen: UserOverviewModal;
  setModalOpen: React.Dispatch<UserOverviewModal>;
}

function UserNavigationModals({ modalOpen, setModalOpen }: IUserNavigationModals) {
  const router = useRouter();
  const [isModal, setIsModal] = useState<boolean>();
  const typeToast = useTypeToast();
  const { data: userInfo } = useUserInfoQuery();

  useEffect(() => {
    if (modalOpen === "spaceSetting") {
      router.replace("/user/setting?preset=on");
      setModalOpen(null);
      return;
    } else if (modalOpen) setIsModal(true);
    if (isModal === false) setModalOpen(null);
  }, [modalOpen, isModal]);

  const [placeInfo, setPlaceInfo] = useState<KakaoLocationProps>();

  const [errorMessage, setErrorMessage] = useState("");

  const queryClient = useQueryClient();
  const { mutate: changeLocationDetail } = useUserInfoFieldMutation("locationDetail", {
    onSuccess() {
      typeToast("change");
      setIsModal(false);
      queryClient.invalidateQueries([USER_INFO]);
    },
  });
  const handleButton = () => {
    if (!placeInfo) {
      setErrorMessage("정확한 장소를 입력해 주세요.");
      return;
    }
    changeLocationDetail({
      text: placeInfo.place_name,
      lon: +placeInfo.x,
      lat: +placeInfo.y,
    });
  };

  return (
    <Layout>
      {modalOpen === "suggest" && <RequestSuggestModal type="suggest" setIsModal={setIsModal} />}

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

      {modalOpen === "profile" && <RequestBirthModal type="profile" setIsModal={setIsModal} />}
      {modalOpen === "isLocationSharingDenided" && (
        <RequestBirthModal type="location" setIsModal={setIsModal} />
      )}

      {modalOpen === "mainPlace" && (
        <RightDrawer title="활동 장소 변경" px={false} onClose={() => setIsModal(false)}>
          <RegisterLocationLayout
            handleButton={handleButton}
            placeInfo={placeInfo}
            setPlaceInfo={setPlaceInfo}
            text="변 경"
            errorMessage={errorMessage}
          />
        </RightDrawer>
      )}
      <RequestLogoutModal isModal={modalOpen === "logout"} setIsModal={setIsModal} />
    </Layout>
  );
}

const Layout = styled.div``;

export default UserNavigationModals;
