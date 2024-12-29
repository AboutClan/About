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
      <Box color="gray.500" fontSize="12px">
        게스트 로그인을 이용중입니다.
      </Box>
      <Box>
        <Button
          border="1px solid black"
          borderColor="mint"
          color="mint"
          borderRadius="4px"
          size="sm"
          mr="8px"
          onClick={() => router.replace(`/home?${newSearchparams.toString()}&logout=on`)}
        >
          로그아웃
        </Button>
        <Button size="sm" colorScheme="mint" borderRadius="4px" onClick={() => customSignin()}>
          동아리 가입 신청
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
  border-top: var(--border-main);
`;

export default GuestBottomNav;
