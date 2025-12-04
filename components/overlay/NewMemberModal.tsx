import { Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";

import { NEW_MEMBER_MODAL_AT } from "../../constants/keys/localStorage";
import { ModalLayout } from "../../modals/Modals";
import { CloseProps } from "../../types/components/modalTypes";
import { navigateExternalLink } from "../../utils/navigateUtils";

interface NewMemberModalProps extends CloseProps {}

function NewMemberModal({ onClose }: NewMemberModalProps) {
  const handleClick = () => {
    navigateExternalLink("https://pf.kakao.com/_SaWXn/109551233");
    localStorage.setItem(NEW_MEMBER_MODAL_AT, dayjs().add(12, "day").format("YYYYMMDD"));
  };

  return (
    <ModalLayout
      title="신규 인원 가이드"
      footerOptions={{
        main: {
          text: "보러 가기",
          func: () => {
            handleClick();
          },
        },
      }}
      setIsModal={onClose}
    >
      <Flex justify="center" mb={5}>
        <Image
          width={64}
          height={64}
          alt="newMember"
          src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/falling-star-3d-icon.png"
        />
      </Flex>
      <p>
        About 멤버가 되신 걸 환영합니다! <br />
        활동을 시작하시기 전에,
        <br /> <b>[신규 인원 가이드]</b>을 꼭 확인해 주세요!
      </p>
    </ModalLayout>
  );
}

export default NewMemberModal;
