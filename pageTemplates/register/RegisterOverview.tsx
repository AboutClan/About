import styled from "styled-components";

function RegisterOverview({ children }) {
  return <Layout>{children}</Layout>;
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.8;
  margin-top: 20px;
  margin-bottom: 20px;
  > span:last-child {
    font-size: 14px;
    color: var(--gray-600);
  }
  > span:first-child {
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-800);
  }
`;

export default RegisterOverview;
