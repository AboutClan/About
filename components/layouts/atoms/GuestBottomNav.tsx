import { Box, Button } from "@chakra-ui/react";
import { signIn, signOut } from "next-auth/react";
import styled from "styled-components";

function GuestBottomNav() {
  const customSignin = async () => {
    await signOut({ redirect: false });
    signIn("kakao", {
      callbackUrl: `${window.location.origin}/home`,
    });
  };

  return (
    <Layout>
      <Box fontSize="12px" color="gray.600">
        게스트 뷰어를 이용하고 있습니다.
      </Box>
      <Box>
        <Button size="sm" colorScheme="mint" onClick={() => customSignin()}>
          동아리 가입하기
        </Button>
      </Box>
    </Layout>
  );
}

const Layout = styled.div`
  position: fixed;
  font-size: 13px;
  bottom: 0;
  transform: translateY(calc(-51.5px - env(safe-area-inset-bottom)));
  width: 100%;
  max-width: var(--max-width);
  background-color: white;
  /* border: var(--border); */
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  font-weight: 600;
  border-top: var(--border);
  box-shadow: 0px -4px 12px 0px rgba(0, 0, 0, 0.04);
`;

export default GuestBottomNav;
