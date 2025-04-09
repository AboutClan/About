import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { useQueryClient } from "react-query";

import InfoBoxCol from "../../components/molecules/InfoBoxCol";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import { USER_INFO } from "../../constants/keys/queryKeys";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { RegisterLocationLayout } from "../../pages/register/location";
import { KakaoLocationProps } from "../../types/externals/kakaoLocationSearch";

interface StudyPageSettingBlockProps {}

function StudyPageSettingBlock({}: StudyPageSettingBlockProps) {
  const typeToast = useTypeToast();
  const queryClient = useQueryClient();
  const { data: userInfo } = useUserInfoQuery();

  const [placeInfo, setPlaceInfo] = useState<KakaoLocationProps>();
  const [errorMessage, setErrorMessage] = useState("");
  const [isModal, setIsModal] = useState(false);

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
    <>
      <Box p={4} pb={3} borderRadius="12px" border="var(--border)" borderColor="gray.200">
        <Box mb={3} fontSize="14px" fontWeight="bold" lineHeight="20px" py={1}>
          내 스터디 설정
        </Box>
        <InfoBoxCol
          infoBoxPropsArr={[
            { category: "스터디 매칭 기준 장소", text: userInfo?.locationDetail?.text },
            {
              category: "최근 참여한 스터디 장소",
              text: userInfo?.studyPreference?.place || "없음",
            },
            {
              category: "자주 참여한 스터디 장소",
              text: userInfo?.studyPreference?.place || "없음",
            },
          ]}
          size="md"
        />
        <Flex
          justify="center"
          align="center"
          fontSize="12px"
          fontWeight="semibold"
          mt={4}
          borderRadius="12px"
          bg="gray.800"
          color="white"
          h="44px"
          onClick={() => setIsModal(true)}
        >
          주 활동 장소 변경하기
        </Flex>
      </Box>
      {isModal && (
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
    </>
  );
}

export default StudyPageSettingBlock;
