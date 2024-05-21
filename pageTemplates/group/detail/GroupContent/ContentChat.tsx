import styled from "styled-components";

function ContentChat() {
  return (
    <Layout>
      <Message>올라온 채팅이 없습니다</Message>
    </Layout>
  );
}

const Layout = styled.div`
  padding: var(--gap-4);
`;

const Message = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  font-size: 16px;
  color: var(--gray-600);
`;

export default ContentChat;
