import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { ModalLayout } from "../../modals/Modals";

function LimitModal() {
  const router = useRouter();

  return (
    <>
      <ModalLayout
        isCloseButton={false}
        title="포인트가 부족해요"
        footerOptions={{
          main: {
            text: "포인트 충전",
            func: () => {
              router.push(`/user/point/charge`);
            },
          },
          sub: {
            text: "기록 확인",
            func: () => {
              router.push(`/user/log/point`);
            },
          },
        }}
        setIsModal={() => {}}
      >
        <Box as="p">
          어바웃에서는 원활한 모임 운영과 노쇼 방지 등을 위해 서비스 재화로 <b>포인트</b>를 사용하고
          있습니다. 활동을 위해서는 최소한의 포인트가 필요합니다.
        </Box>
      </ModalLayout>
    </>
  );
}

export default LimitModal;
