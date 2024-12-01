import styled from "styled-components";

function RegisterOverview({ children }) {
  return <Layout>{children}</Layout>;
}

const Layout = styled.div`
  display: flex;

  flex-direction: column;
  line-height: 1.8;
  margin-top: 20px;
  margin-bottom: 40px;
  > span:last-child {
    font-weight: light;
    font-size: 13px;
    line-height: 20px;
    color: var(--gray-600);
  }
  > span:first-child {
    font-size: 24px;
    font-weight: bold;
    line-height: 36px;
    color: var(--gray-800);
    margin-bottom: 8px;
  }
`;

export default RegisterOverview;
