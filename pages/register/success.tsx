import { useRouter } from "next/router";
import styled from "styled-components";
import BottomNav from "../../components/layouts/BottomNav";

function ApplySuccess() {
  const router = useRouter();
  return (
    <Layout>
      <Content2>
        <i className="fa-solid fa-circle-check fa-5x" style={{ color: "var(--color-mint)" }} />

        <Content>
          <span>신청이 완료됐어요!</span>
          <span style={{ textAlign: "center" }}>
            확인하는대로 연락 드릴게요!
            <br /> 조금만 기다려주세요~!
          </span>
        </Content>
      </Content2>
      <BottomNav text="확인" onClick={() => router.push(`/login`)} />
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
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: var(--gap-4);
  > span:first-child {
    color: var(--gray-800);
    font-weight: 600;
    font-size: 22px;
  }
  > span:last-child {
    margin-top: var(--gap-3);
    font-size: 17px;
    color: var(--gray-700);
  }
`;

export default ApplySuccess;
