import { Box, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";

import Divider from "../../../components/atoms/Divider";
import { Input } from "../../../components/atoms/Input";
import InfoList from "../../../components/atoms/lists/InfoList";
import RightDrawer from "../../../components/organisms/drawer/RightDrawer";
import { USER_INFO } from "../../../constants/keys/queryKeys";
import { useTypeToast } from "../../../hooks/custom/CustomToast";
import { usePointSystemMutation, useUserInfoFieldMutation } from "../../../hooks/user/mutations";
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

  const { mutate } = usePointSystemMutation("point");

  const handleCoupon = () => {
    mutate({ value: 2000, message: "", sub: "coupon" });
  };

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
      {modalOpen === "coupon" && (
        <RightDrawer title="쿠폰 입력" onClose={() => setIsModal(false)}>
          <Box mt={5}>
            <Input placeholder="쿠폰 번호를 입력해 주세요." />
          </Box>
          <Button mt={5} colorScheme="mint" w="full">
            사용하기
          </Button>
          <Box py={10}>
            <Divider />
          </Box>
          <InfoList
            items={[
              "같은 쿠폰은 계정 당 1회만 사용 가능합니다.",
              "유효기간이 지난 쿠폰은 사용하실 수 없습니다.",
              "부정한 방법으로 획득한 쿠폰은 회수될 수 있습니다.",
              "쿠폰으로 지급된 포인트는 환급받을 수 없습니다.",
            ]}
          />
        </RightDrawer>
      )}

      {modalOpen === "mainPlace" && (
        <RightDrawer title="활동 장소 변경" px={false} onClose={() => setIsModal(false)}>
          <RegisterLocationLayout
            isSlide={false}
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
