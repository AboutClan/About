import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { useQueryClient } from "react-query";

import SearchLocation from "../../components/organisms/SearchLocation";
import { USER_INFO } from "../../constants/keys/queryKeys";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { KakaoLocationProps } from "../../types/externals/kakaoLocationSearch";
import { IFooterOptions, ModalLayout } from "../Modals";

interface LocationRegisterPopUp extends IModal {}

function LocationRegisterPopUp({ setIsModal }: LocationRegisterPopUp) {
  const toast = useToast();
  const [placeInfo, setPlaceInfo] = useState<KakaoLocationProps>({
    place_name: "",
    road_address_name: "",
  });

  const queryClient = useQueryClient();
  const { mutate } = useUserInfoFieldMutation("locationDetail", {
    onSuccess() {
      toast("success", "등록되었습니다. 이후 연락을 기다려주세요!");
      queryClient.invalidateQueries([USER_INFO]);
      setIsModal(false);
    },
    onError() {
      setIsModal(false);
    },
  });

  const footerOptions: IFooterOptions = {
    main: {
      text: "활동 장소 입력 완료",
      func: () => {
        const { place_name: placeName, y, x } = placeInfo;
        if (!placeName || !y || !x) {
          toast("error", "누락된 항목이 있습니다.");
          return;
        }

        mutate({
          text: placeName,
          lat: +y,
          lon: +x,
        });
      },
    },
  };

  return (
    <ModalLayout title="주 활동 장소 등록" footerOptions={footerOptions} setIsModal={setIsModal}>
      <ModalSubtitle>등록 장소에 따라 소속 동네 모임이 결정됩니다.</ModalSubtitle>
      <Box h="228px">
        <SearchLocation placeInfo={placeInfo} setPlaceInfo={setPlaceInfo} isSmall={true} />
      </Box>
    </ModalLayout>
  );
}

export default LocationRegisterPopUp;
