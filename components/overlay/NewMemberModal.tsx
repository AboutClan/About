import { Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";

import { NEW_MEMBER_MODAL_AT } from "../../constants/keys/localStorage";
import { ModalLayout } from "../../modals/Modals";
import { CloseProps } from "../../types/components/modalTypes";
import { isWebView } from "../../utils/appEnvUtils";
import { nativeMethodUtils } from "../../utils/nativeMethodUtils";

interface NewMemberModalProps extends CloseProps {}

function NewMemberModal({ onClose }: NewMemberModalProps) {
  const handleClick = () => {
    const url = "https://invite.kakao.com/tc/HOmUdQMjSs";
    if (isWebView()) {
      nativeMethodUtils.openExternalLink(url);
    } else {
      window.open(url, "_blank");
    }
    localStorage.setItem(NEW_MEMBER_MODAL_AT, dayjs().add(9, "day").format("YYYYMMDD"));
  };

  return (
    <ModalLayout
      title="신규 인원 가이드"
      footerOptions={{
        main: {
          text: "팀 채팅방 입장",
          func: () => {
            handleClick();
          },
        },
        sub: { text: "다음에" },
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
        About 멤버가 되신 걸 환영합니다! 활동을 시작하시기 전에, <b>[자주 묻는 질문]</b>을 꼭 확인해
        주세요!
        <br />
        <br /> 또한 <b>About 팀 채팅방</b>에서 여러 동아리 행사를 안내하고 있으니, 아래 링크로
        입장해 주세요!
      </p>
    </ModalLayout>
  );
}

export default NewMemberModal;
