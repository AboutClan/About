import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { ModalLayout } from "../../modals/Modals";
import { CloseProps } from "../../types/components/modalTypes";
import Avatar from "../atoms/Avatar";

function PointLowModal({ onClose }: CloseProps) {
  const router = useRouter();
  return (
    <ModalLayout
      title="활동 지원금 지급 안내"
      isCloseButton={false}
      footerOptions={{
        main: {},
        sub: {
          text: "포인트 기록 보기",
          func: () => router.push("/user/log/point"),
        },
      }}
      setIsModal={onClose}
    >
      <Flex justify="center" mb={5}>
        <Avatar user={{ avatar: { type: 13, bg: 0 } }} size="xl1" isLink={false} />
      </Flex>
      <p>
        포인트가 <b>0원</b>이 되어, 활동 유지를 위한 <b>1회 한정 지원금</b>이 지급되었습니다. 이후
        다시 0원이 되면, 활동을 위해 최소 3,000원 충전이 필요합니다.
      </p>
    </ModalLayout>
  );
}

export default PointLowModal;
