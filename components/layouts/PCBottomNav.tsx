import { Button } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";

function PCBottomNav() {
  const searchParams = useSearchParams();
  const newSearchparams = new URLSearchParams(searchParams);
  const router = useRouter();

  return (
    <Layout>
      <span>설치 가능한 모바일 앱이 있습니다.</span>
      <Button
        backgroundColor="var(--color-red)"
        color="white"
        size="xs"
        onClick={() => router.replace(`/home?${newSearchparams.toString()}&logout=on`)}
      >
        방법 보러가기
      </Button>
    </Layout>
  );
}

const Layout = styled.div`
  position: fixed;
  bottom: 77px;
  max-width: var(--max-width);
  background-color: white;
  height: 50px;
  width: 100dvw;
  border: var(--border);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  color: var(--color-red);
  font-weight: 600;
`;

export default PCBottomNav;
