import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

import Header from "../../../components/layouts/Header";
import { ModalLayout } from "../../../modals/Modals";

function RegisterAccessHeader() {
  const router = useRouter();
  const [isBackModal, setIsBackModal] = useState(false);
  const handleBack = () => {
    setIsBackModal(true);
  };
  return (
    <>
      <Header title="회원 가입" func={handleBack}>
        {/* <Button
          p={1}
          color="gray.500"
          fontWeight={600}
          variant="unstyled"
          onClick={() => {
            navigateExternalLink(`https://pf.kakao.com/_SaWXn/chat`);
          }}
        >
          문의하기
        </Button> */}
      </Header>
      {isBackModal && (
        <ModalLayout
          isCloseButton={false}
          title="가입을 취소하시겠어요?"
          setIsModal={() => setIsBackModal(false)}
          footerOptions={{
            main: {
              text: "이 동",
              func: () => {
                router.push("/login?status=waiting");
              },
            },
            sub: {
              text: "닫 기",
            },
          }}
        >
          <Box as="p">
            로그인 화면으로 이동합니다.
            <br />
            <b> 카카오 로그인</b>을 통해 다시 돌아올 수 있어요.
          </Box>
        </ModalLayout>
      )}
    </>
  );
}

export default RegisterAccessHeader;
