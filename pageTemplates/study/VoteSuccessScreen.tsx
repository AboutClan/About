import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import styled from "styled-components";

function VoteSuccessScreen() {
  // const setIsCompleteModal = useSetRecoilState(isVoteCompletedState);
  const router = useRouter();
  const onClicked = () => {
    // setIsCompleteModal(false);
    router.push(`/home`);
  };
  return (
    <Layout>
      <Icon>
        <FontAwesomeIcon icon={faCheckCircle} size="5x" />
      </Icon>
      <Content>
        <span>투표를 완료했어요</span>
        <span>스터디 결과는 오후 10시에 확인할 수 있어요 !</span>
      </Content>
      <Button onClick={onClicked}>홈으로</Button>
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
    color: var(--gray-900);
    font-weight: 600;
    font-size: 22px;
  }
  > span:last-child {
    font-size: 17px;
    color: var(--gray-700);
  }
`;
const Button = styled.button`
  width: 335px;
  margin-top: auto;
  margin-bottom: 16px;

  border-radius: var(--rounded);
  color: white;
  padding: 14px 100px 14px 100px;
  font-size: 15px;
  font-weight: 700;

  background-color: var(--color-mint);
`;

export default VoteSuccessScreen;
