import styled from "styled-components";

interface IStoreDetailDetails {
  winnerCnt: number;
  max: number;
}

function StoreDetailDetails({ winnerCnt, max }: IStoreDetailDetails) {
  return (
    <Layout>
      <DetailItem>
        <span>추첨인원</span>
        <span>{winnerCnt}명</span>
      </DetailItem>
      <DetailItem>
        <span>응모 가능 인원</span>
        <span>{max}명</span>
      </DetailItem>
      <DetailItem>
        <span>안내사항</span>
        <div>
          <span>당첨자는 중복되지 않습니다.</span>
          <span>당첨자가 연락이 안되는 경우, 예비 당첨자로 순번이 넘어갑니다.</span>
          <span></span>
        </div>
      </DetailItem>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: var(--gap-5);
`;

const DetailItem = styled.div`
  display: flex;
  font-size: 13px;
  color: var(--gray-2);
  margin-bottom: var(--gap-1);
  > span:first-child {
    color: var(--gray-1);
    display: inline-block;
    font-weight: 600;
    width: 100px;
  }
  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`;

export default StoreDetailDetails;
