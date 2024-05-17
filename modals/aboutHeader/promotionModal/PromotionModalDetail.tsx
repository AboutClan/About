import dayjs from "dayjs";
import styled from "styled-components";

import Skeleton from "../../../components/atoms/skeleton/Skeleton";
import { useUserRequestQuery } from "../../../hooks/admin/quries";

function PromotionModalDetail() {
  const { data: promotionData, isLoading } = useUserRequestQuery("홍보");

  const applyCnt = promotionData?.length + 20;
  const currentMonth = dayjs().month();

  return (
    <Layout>
      <div>
        <span>상품</span>
        <span>BBQ 황금 올리브 치킨 세트</span>
      </div>
      <div>
        <span>추첨 인원</span>
        <span>3명</span>
      </div>
      <div>
        <span>현재 참여 수</span>
        <VoteNum>
          <Skeleton isLoaded={!isLoading}>
            {applyCnt || ""}명<Temp>(중복 포함)</Temp>
          </Skeleton>
        </VoteNum>
      </div>
      <div>
        <span>추첨 날짜</span>
        <span>{currentMonth + 2}월 3일</span>
      </div>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    > span:first-child {
      display: inline-block;
      width: 88px;
      font-weight: 600;
    }
  }
`;
const Temp = styled.span`
  font-size: 11px;
  color: var(--gray-700);
`;
const VoteNum = styled.span``;

export default PromotionModalDetail;
