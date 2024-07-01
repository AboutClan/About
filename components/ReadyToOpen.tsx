import styled from "styled-components";

function ReadyToOpen() {
  return (
    <Layout>
      <span>COMING SOON</span>
    </Layout>
  );
}

const Layout = styled.div`
  background-color: rgba(234, 236, 240, 0.6);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 26px;
  font-weight: 700;
  border-radius: var(--rounded-lg);
  color: var(--gray-800);
  > span {
    opacity: 1;
  }
`;

export default ReadyToOpen;
