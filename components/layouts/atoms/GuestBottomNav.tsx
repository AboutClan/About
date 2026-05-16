import { Box, Button, Flex } from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { useToast } from "../../../hooks/custom/CustomToast";
import { ModalLayout } from "../../../modals/Modals";
import { isWebView } from "../../../utils/appEnvUtils";
import { setAuthIntent } from "../../../utils/authIntentUtils";
import { navigateExternalLink } from "../../../utils/navigateUtils";
import { getSafeAreaBottom } from "../../../utils/validationUtils";
function GuestBottomNav() {
  const { data: session } = useSession();
  const toast = useToast();
  const [isModal, setIsModal] = useState(false);
  const customSignin = async () => {
    if (isWebView() && (!session || session?.user?.role === "guest")) {
      setIsModal(true);
      return;
    }
    setAuthIntent();
    await signOut({ redirect: false });
    await signIn("kakao", { callbackUrl: "/home" });
  };

  return (
    <>
      <Flex
        position="fixed"
        bottom="0"
        transform={`translateY(calc(-1 * var(--bottom-nav-height) + 1px - ${getSafeAreaBottom(
          0,
        )}))`}
        w="100%"
        maxW="var(--max-width)"
        bg="gray.50" // 기존 흰색 대신 살짝 밝은 톤으로 구분 강화
        zIndex="100"
        px="4"
        py="2"
        align="center"
        justify="space-between"
        borderTop="1px solid"
        borderColor="gray.200" // 더 명확한 구분
        boxShadow="0px -4px 12px rgba(0, 0, 0, 0.05)"
        borderTopRadius="lg"
        fontSize="13px"
        fontWeight="500"
      >
        <Flex direction="column" fontSize="11px" lineHeight="short">
          <Box fontWeight="700" color="gray.700">
            게스트 모드로 둘러보는 중 👀
          </Box>
          <Box color="gray.500">가입 후 모든 모임에 참여할 수 있어요!</Box>
        </Flex>

        <Button size="sm" colorScheme="mint" onClick={customSignin}>
          동아리 활동 시작하기
        </Button>
      </Flex>
      {isModal && (
        <ModalLayout
          setIsModal={setIsModal}
          title="로그인"
          footerOptions={{
            main: {
              text: "기존 멤버 로그인",
              func: async () => {
                setAuthIntent();
                await signOut({ redirect: false });
                await signIn("kakao", { callbackUrl: "/home" });
              },
            },
            sub: {
              text: "신규 멤버 가입",
              func: () => {
                toast("info", "원활한 가입 진행를 위해 웹사이트로 전환합니다.");
                setTimeout(() => {
                  navigateExternalLink("https://study-about.club/login/confirm");
                }, 1000);
                return;
              },
            },
          }}
        >
          로그인 방식을 선택해 주세요!
        </ModalLayout>
      )}
    </>
  );
}

export default GuestBottomNav;
