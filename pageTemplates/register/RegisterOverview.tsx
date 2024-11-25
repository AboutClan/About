import styled from "styled-components";

function RegisterOverview({ children }) {
  return <Layout>{children}</Layout>;
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.8;
  margin-top: 40px;
  margin-bottom: 20px;
  > span:last-child {
    font-size: 13px;
    color: var(--gray-600);
  }
  > span:first-child {
    font-size: 18px;
    font-weight: bold;
    line-height: 28px;
    color: var(--gray-800);
    margin-bottom: 4px;
  }
`;

export default RegisterOverview;
