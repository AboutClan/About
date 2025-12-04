import { Flex } from "@chakra-ui/react";

import { ModalLayout } from "../../modals/Modals";
import { CloseProps } from "../../types/components/modalTypes";
import { navigateExternalLink } from "../../utils/navigateUtils";
import Avatar from "../atoms/Avatar";

function KakaoFriendModal({ onClose }: CloseProps) {
  return (
    <ModalLayout
      title="카카오 채널 추가"
      footerOptions={{
        main: {
          text: "친구 추가하고 포인트 받기",
          func: () => {
            navigateExternalLink("https://pf.kakao.com/_SaWXn/friend");
          },
        },
      }}
      setIsModal={onClose}
    >
      <Flex justify="center" mb={5}>
        <Avatar user={{ avatar: { type: 2, bg: 2 } }} size="xl1" isLink={false} />
      </Flex>
      <p>
        <b>About 카카오 채널</b> 친구 추가가 되어있나요? <br />
        동아리 공지사항과 이벤트 소식이 전달되고,
        <br /> 채널 추가 시 <b>1,000 포인트</b>가 지급됩니다.
      </p>
    </ModalLayout>
  );
}

export default KakaoFriendModal;
