import styled from "styled-components";

function PromotionOverview() {
  return (
    <Layout>
      학교 에브리타임 홍보게시판에 동아리 홍보글을 작성해주시면 <b>+50 Point</b>와 추첨을 통해 매 달{" "}
      <b>BBQ 황금 올리브 치킨 세트</b>를 드립니다! 학교 당 3일에 1번씩만 참여가 가능합니다.
    </Layout>
  );
}

const Layout = styled.div`
  margin-top: var(--gap-4);
  font-size: 12px;
  color: var(--gray-800);
`;

export default PromotionOverview;
