import styled from "styled-components";

function RecordTotal() {
  return (
    <Layout>
      <span>누적 스터디 열린 횟수: 4회</span>
      <span>누적 스터디 열린 횟수: 4회</span>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 14px;
`;

export default RecordTotal;
