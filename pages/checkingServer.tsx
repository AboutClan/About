import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import styled from "styled-components";

function CheckingServer() {
  const router = useRouter();

  return (
    <Layout>
      <Title>
        로그인 창에서 카카오 로그인을 통해 접속해주세요!
        <br /> 그래도 안되는 경우 관리자에게 말씀해주세요!
      </Title>
      <Nav>
        <Button w="50%" colorScheme="blackAlpha" onClick={() => router.push(`/home`)}>
          재접속
        </Button>
        <Button w="50%" colorScheme="mintTheme" onClick={() => router.push(`/login`)}>
          로그인 창으로
        </Button>
      </Nav>
    </Layout>
  );
}

const Layout = styled.div`
  padding: var(--gap-4);
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  background-color: var(--gray-300);
`;

const Title = styled.div`
  font-size: 16px;
`;

const Nav = styled.nav`
  margin-top: var(--gap-5);
  display: flex;
`;

export default CheckingServer;
