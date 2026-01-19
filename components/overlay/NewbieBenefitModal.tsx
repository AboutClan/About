import { Badge, Box } from "@chakra-ui/react";
import { useState } from "react";

import { ModalLayout } from "../../modals/Modals";
import { CloseProps } from "../../types/components/modalTypes";
import { navigateExternalLink } from "../../utils/navigateUtils";
import TextCheckButton from "../molecules/TextCheckButton";
import ValueBoxCol from "../molecules/ValueBoxCol";

function NewbieBenefitModal({ onClose }: CloseProps) {
  const [isCheckInsta, setIsCheckInsta] = useState(false);
  const [isCheckKakao, setIsCheckKakao] = useState(false);

  const getMembership = () => {};

  return (
    <ModalLayout
      title="멤버십을 받을 수 있어요!"
      isCloseButton={false}
      footerOptions={{
        main: {
          text: "멤버십 수령",
          func: getMembership,
        },
        sub: { text: "닫 기" },
      }}
      setIsModal={onClose}
    >
      <Box as="p">
        카카오 채널 추가와 인스타 팔로우를 완료하시면, 한달간 뉴비 멤버십 혜택을 받을 수 있습니다.
      </Box>
      <Box my={2}>
        <Badge
          as="button"
          px={2}
          py={1}
          borderRadius="8px"
          fontWeight="700"
          fontSize="9px"
          color="white"
          bg="linear-gradient(135deg, #00C2B3 0%, #007DFB 100%)"
          position="relative"
          overflow="hidden"
          sx={{
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "80%",
              height: "100%",
              background:
                "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)",
              transform: "skewX(-20deg)",
              animation: "shine 2.4s infinite ease-in-out",
            },

            "@keyframes shine": {
              "0%": { left: "-100%" },
              "70%": { left: "130%" },
              "100%": { left: "130%" },
            },
          }}
        >
          뉴비 멤버십 혜택
        </Badge>
      </Box>
      <ValueBoxCol
        items={[
          {
            left: "일일 출석체크",
            right: "+ 20% 포인트",
          },
          {
            left: "공부 인증 리워드",
            right: "+ 20% 포인트",
          },
          {
            left: "스터디 참여 리워드",
            right: "+ 20% 포인트",
          },
          {
            left: "번개 참여권",
            right: "월 1장 추가",
          },
          {
            left: "소모임 참여권",
            right: "월 2장 추가",
          },
        ]}
      />
      <Box mt={2} mb={2}>
        <TextCheckButton
          text="카카오 채널 추가"
          isChecked={isCheckKakao}
          toggleCheck={() => setIsCheckKakao((old) => !old)}
          buttonText="이동하기"
          handleBtn={() => {
            setIsCheckKakao(true);
            navigateExternalLink("https://pf.kakao.com/_SaWXn/friend");
          }}
        />
      </Box>
      <TextCheckButton
        text="인스타 팔로우"
        isChecked={isCheckInsta}
        toggleCheck={() => setIsCheckInsta((old) => !old)}
        buttonText="이동하기"
        handleBtn={() => {
          setIsCheckInsta(true);
          navigateExternalLink("https://www.instagram.com/about._.20s/");
        }}
      />
    </ModalLayout>
  );
}

export default NewbieBenefitModal;
