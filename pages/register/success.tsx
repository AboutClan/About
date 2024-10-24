import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";

import BottomNav from "../../components/layouts/BottomNav";

function ApplySuccess() {
  const router = useRouter();
  return (
    <Layout>
      <Content2>
        <Box>
          <i className="fa-solid fa-circle-check fa-5x" style={{ color: "var(--color-mint)" }} />
        </Box>
        <Flex mt="20px" fontSize="16px" direction="column" align="center">
          <Box fontSize="22px" fontWeight={800}>
            가입 신청이 완료됐어요!
          </Box>
          <Box my="12px" color="var(--gray-700)">
            곧 운영진이 확인 후 최종 연락을 드릴 예정입니다. <br /> 톡방에 성함을 남겨주시면 더 빠른
            가입이 가능해요!
          </Box>
        </Flex>
        <Box mt="8px" mx="auto">
          <Link href="https://open.kakao.com/o/sapxSHGg">
            <Button variant="ghost" textDecor="underline" colorScheme="mint" fontWeight={400}>
              어바웃 문의 톡방
            </Button>
          </Link>
        </Box>
      </Content2>
      <BottomNav text="로그인 화면으로 이동" onClick={() => router.push(`/login`)} />
    </Layout>
  );
}

const Layout = styled.div`
  min-height: 100vh;
  background-color: var(--gray-100);
  display: flex;
  flex-direction: column;
`;

const Content2 = styled.div`
  position: fixed;
  top: 43%;
  left: 50%;
  transform: translate(-50%, -50%);
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  text-align: center;
`;

export default ApplySuccess;
