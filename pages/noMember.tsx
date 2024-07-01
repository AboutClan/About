import { useRouter } from "next/router";
import styled from "styled-components";

import { XAlertIcon } from "../components/atoms/Icons/AlertIcon";

function NoMember() {
  const router = useRouter();

  return (
    <Layout>
      <Icon>
        <XAlertIcon />
      </Icon>
      <Content>
        <span>접근 권한이 없어요!</span>
        <span style={{ textAlign: "center" }}>
          현재 동아리원이 맞으신가요?
          <br /> 참여를 위해서는 관리자에게 문의해 주세요!
        </span>
      </Content>

      <Button onClick={() => router.push(`/login`)}>확인</Button>
    </Layout>
  );
}

const Layout = styled.div`
  width: 375px;
  height: 100vh;
  left: 50%;
  top: 0;
  transform: translate(-50%, 0);
  z-index: 2000;
  position: fixed;
  background-color: white;
`;

const Icon = styled.div`
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-mint);
`;

const Content = styled.div`
  width: 100%;
  position: absolute;
  top: 39%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  > span:first-child {
    color: var(--gray-800);
    font-weight: 600;
    font-size: 22px;
  }
  > span:last-child {
    display: inline-block;
    margin-top: 14px;
    font-size: 17px;
    color: var(--gray-700);
    font-weight: 500;
  }
`;

const Button = styled.button`
  width: 335px;
  position: absolute;
  top: 640px;
  border-radius: 13px;
  color: white;
  padding: 14px 100px 14px 100px;
  font-size: 15px;
  font-weight: 700;
  gap: 10px;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-mint);
`;

export default NoMember;
