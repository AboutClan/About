import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";

import InfoBoxCol from "../../components/molecules/InfoBoxCol";
import { useUserInfoQuery } from "../../hooks/user/queries";
import StudyPresetModal from "../../modals/userRequest/StudyPresetModal";

interface StudyPageSettingBlockProps {}

function StudyPageSettingBlock({}: StudyPageSettingBlockProps) {
  const { data: userInfo } = useUserInfoQuery();
  const [isModal, setIsModal] = useState(false);

  return (
    <>
      <Box p={4} pb={3} borderRadius="12px" border="var(--border)" borderColor="gray.200">
        <Box mb={3} fontSize="14px" fontWeight="bold" lineHeight="20px" py={1}>
          내 스터디 설정
        </Box>
        <InfoBoxCol
          infoBoxPropsArr={[
            { category: "중심 활동지", text: userInfo?.locationDetail?.text },
            { category: "즐겨 찾기 장소", text: userInfo?.studyPreference?.place || "미등록" },
            { category: "서브 추천 장소", text: userInfo?.studyPreference?.place || "미등록" },
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
          설정하기
        </Flex>
      </Box>
      {isModal && <StudyPresetModal setIsModal={setIsModal} />}
    </>
  );
}

export default StudyPageSettingBlock;
