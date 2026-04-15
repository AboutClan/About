import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

import InfoList from "../../components/atoms/lists/InfoList";
import Slide from "../../components/layouts/PageSlide";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useCheckGuest } from "../../hooks/custom/UserHooks";
import { ModalLayout } from "../../modals/Modals";
import { StudyConfirmedMemberProps } from "../../types/models/studyTypes/study-entity.types";
import { getSafeAreaBottom } from "../../utils/validationUtils";
import { CheckIcon } from "../vote/StudyControlButton";
interface StudyExtraButtonProps {
  myStudyInfo: StudyConfirmedMemberProps;
}

function StudyExtraButton({ myStudyInfo }: StudyExtraButtonProps) {
  const isGuest = useCheckGuest();
  const typeToast = useTypeToast();
  const isAttend = myStudyInfo?.attendance?.type === "arrived";

  const [isGuideModal, setIsGuideModal] = useState(false);

  return (
    <>
      <Slide isFixed zIndex={200}>
        <Flex
          position="fixed"
          zIndex={100}
          fontSize="12px"
          lineHeight="24px"
          fontWeight={700}
          bottom={isAttend ? getSafeAreaBottom(76) : getSafeAreaBottom(76)}
          right="20px"
        >
          <Button
            fontSize="12px"
            h="40px"
            color="white"
            px={4}
            borderRadius="20px"
            lineHeight="24px"
            iconSpacing={1}
            colorScheme="black"
            rightIcon={<CheckIcon />}
            onClick={() => {
              if (isGuest) {
                typeToast("guest");
                return;
              }
              setIsGuideModal(true);
            }}
            _hover={{
              background: undefined,
            }}
          >
            가이드
          </Button>
        </Flex>
      </Slide>

      {isGuideModal && (
        <ModalLayout
          title="출석 이후 가이드"
          setIsModal={() => {
            setIsGuideModal(false);
          }}
          footerOptions={{}}
        >
          <Box mb={3}>스터디 출석 후 난감해 하고 있는 당신을 위해 ...!</Box>
          <InfoList
            items={[
              "다른 사람의 출석 정보를 먼저 확인해요.",
              "먼저 온 멤버를 찾아 가볍게 인사해 주세요!",
              "못 찾겠다면, 스터디 톡방에 물어보면 됩니다.",
              "같이 공부해도 되고, 혼자 공부해도 돼요!",
              "식사 의향이 있다면, 같이 먹을지 물어봐요.",
              "스터디를 마칠 때도 가볍게 인사해 주세요!",
              "장소를 변경한다면, 톡방에도 알려주세요.",
            ]}
          />
        </ModalLayout>
      )}
    </>
  );
}

export default StudyExtraButton;
