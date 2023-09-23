import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { isVoteCompletedState } from "../../recoil/renderTriggerAtoms";

interface ISuccessScreen {
  children?: React.ReactNode;
  url?: string;
}

function SuccessScreen({ children, url }: ISuccessScreen) {
  const router = useRouter();

  const setIsCompleteModal = useSetRecoilState(isVoteCompletedState);

  const onClicked = () => {
    setIsCompleteModal(false);
    router.push(url || `/about`);
  };

  return (
    <Layout>
      <Icon>
        <FontAwesomeIcon icon={faCheckCircle} size="5x" />
      </Icon>
      <Content>{children}</Content>
      <Button onClick={onClicked}>확인</Button>
    </Layout>
  );
}

const Layout = styled.div`
  width: 100vw;
  height: 100vh;
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
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;

  > span:first-child {
    color: var(--font-h1);
    font-weight: 600;
    font-size: 22px;
  }
  > *:last-child {
    margin-top: 12px;
    text-align: center;
    font-size: 17px;
    color: var(--font-h3);
  }
`;
const Button = styled.button`
  width: 335px;
  margin-top: auto;
  margin-bottom: 16px;

  border-radius: var(--border-radius-sub);
  color: white;
  padding: 14px 100px 14px 100px;
  font-size: 15px;
  font-weight: 700;

  background-color: var(--color-mint);
`;

export default SuccessScreen;