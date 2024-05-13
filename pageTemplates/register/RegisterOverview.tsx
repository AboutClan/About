import styled from "styled-components";

function RegisterOverview({ children }) {
  return <Layout>{children}</Layout>;
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.8;
  margin-top: 20px;
  margin-bottom: 16px;
  > span:last-child {
    font-size: 14px;
    color: var(--gray-700);
  }
  > span:first-child {
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
  }
`;

export default RegisterOverview;
