import { Box, Button } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import styled from "styled-components";

import { iPhoneNotchSize } from "../../../utils/validationUtils";

function GuestBottomNav() {
  const searchParams = useSearchParams();
  const newSearchparams = new URLSearchParams(searchParams);
  const router = useRouter();

  const customSignin = async () => {
    await signOut({ redirect: false });
    signIn("kakao", {
      callbackUrl: `${window.location.origin}/home`,
    });
  };

  return (
    <Layout>
      <span>게스트 로그인을 이용중입니다.</span>
      <Box>
        <Button
          bgColor="white"
          size="xs"
          border="1px solid black"
          borderColor="gray.800"
          mr="8px"
          borderRadius="4px"
          onClick={() => customSignin()}
        >
          회원가입
        </Button>
        <Button
          colorScheme="black"
          borderRadius="4px"
          size="xs"
          onClick={() => router.replace(`/home?${newSearchparams.toString()}&logout=on`)}
        >
          로그아웃
        </Button>
      </Box>
    </Layout>
  );
}

const Layout = styled.div`
  position: fixed;
  font-size: 13px;
  bottom: ${`${52 + iPhoneNotchSize()}px`};
  max-width: var(--max-width);
  background-color: white;

  width: 100dvw;
  border: var(--border);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px;

  font-weight: 600;
  border-top: var(--border);
`;

export default GuestBottomNav;
