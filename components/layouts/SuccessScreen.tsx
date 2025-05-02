import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import { isVoteCompletedState } from "../../recoils/renderRecoils";

interface ISuccessScreen {
  children?: React.ReactNode;
  url?: string;
}

function SuccessScreen({ children, url }: ISuccessScreen) {
  const router = useRouter();

  const setIsCompleteModal = useSetRecoilState(isVoteCompletedState);

  const onClicked = () => {
    setIsCompleteModal(false);
    router.push(url || `/home`);
  };

  return (
    <Layout>
      <Icon>
        <i className="fa-solid fa-check-circle fa-5x" />
      </Icon>
      <Content>{children}</Content>
      <Button
        position="fixed"
        left="50%"
        bottom="0"
        maxW="var(--view-max-width)"
        transform="translate(-50%,0)"
        width="calc(100% - 2*var(--gap-4))"
        size="lg"
        mb="var(--gap-4)"
        borderRadius="var(--rounded)"
        backgroundColor="var(--color-mint)"
        color="white"
        fontSize="15px"
        onClick={onClicked}
        _focus={{ backgroundColor: "var(--color-mint)", color: "white" }}
      >
        확인
      </Button>
    </Layout>
  );
}

const Layout = styled.div`
  width: 100vw;
  max-width: var(--max-width);
  height: 100%;
  left: 50%;
  top: 0;
  transform: translate(-50%, 0);
  z-index: 2000;
  position: fixed;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Icon = styled.div`
  margin-top: 34%;

  color: var(--color-mint);
`;

const Content = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  > span:first-child {
    color: var(--gray-800);
    font-weight: 800;
    font-size: 24px;
  }
  > *:last-child {
    margin-top: 8px;
    text-align: center;
    font-size: 16px;
    color: var(--gray-500);
  }
`;

export default SuccessScreen;
