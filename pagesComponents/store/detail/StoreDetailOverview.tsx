import styled from "styled-components";
import { IStoreGift } from "../../../types/page/store";

interface IStoreDetailOverview {
  info: IStoreGift;
  totalApplyCnt: number;
  isActive: boolean;
}

function StoreDetailOverview({
  info,
  totalApplyCnt,
  isActive,
}: IStoreDetailOverview) {
  return (
    <Layout>
      <Overview>
        <span>{info.name}</span>
        <span>{info.brand}</span>
      </Overview>
      <Price>{info.point} point</Price>
      <ApplyCnt>
        현재 전체 응모 횟수는 <b>{!isActive ? info.max : totalApplyCnt}회</b>
        입니다.
      </ApplyCnt>
    </Layout>
  );
}

const Layout = styled.div``;

const Overview = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: var(--margin-sub);
  > span:first-child {
    font-size: 18px;
    font-weight: 800;
  }
  > span:last-child {
    color: var(--font-h3);
  }
`;
const Price = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: var(--color-mint);
  margin-bottom: var(--margin-sub);
`;

const ApplyCnt = styled.div`
  color: var(--font-h3);
  > b {
    color: var(--font-h1);
  }
`;

export default StoreDetailOverview;
