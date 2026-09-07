import styled from "styled-components";

interface IRankingBar {
  isScore: boolean;
}

function RankingBar({ isScore }: IRankingBar) {
  return (
    <Layout>
      <span>랭킹</span>
      <span>이름</span>
      <span>{isScore ? "점수" : "횟수"}</span>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  margin-bottom: var(--gap-3);
  align-items: center;
  padding: 0 var(--gap-2);
  > span {
    font-weight: 600;
  }
  > span:first-child {
    flex: 0.2;
    text-align: start;
  }
  > span:nth-child(2) {
    flex: 1;
    margin-left: var(--gap-3);
  }
  > span:last-child {
    margin-right: var(--gap-1);
  }
`;

export default RankingBar;
