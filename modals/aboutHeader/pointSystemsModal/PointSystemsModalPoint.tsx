import { Box, ListItem, UnorderedList } from "@chakra-ui/react";
import styled from "styled-components";

import { POINT_SYSTEM_PLUS } from "../../../constants/serviceConstants/pointSystemConstants";

function PointSystemsModalPoint() {
  return (
    <>
      <Layout>
        <Item>
          <Name>스터디 출석</Name>
          <i className="fa-light fa-2x fa-check-circle" />
          <Point isDoublePoint={true}>5 포인트</Point>
        </Item>
        <Item>
          <Name>일일 출석</Name>
          <i className="fa-light fa-2x fa-badge-check" />
          <Point isDoublePoint={true}>{POINT_SYSTEM_PLUS.DAILY_ATTEND.value} 포인트</Point>
        </Item>
        <Item>
          <Name>모임 참여</Name> <i className="fa-light fa-2x fa-party-horn" />
          <Point isDoublePoint={true}>10 포인트</Point>
        </Item>
        <Item>
          <Name>스터디 투표</Name>
          <i className="fa-light fa-2x fa-check-to-slot" />
          <Point>2~20 포인트</Point>
        </Item>
        <Item>
          <Name>좋아요</Name>
          <i className="fa-light fa-2x fa-heart-circle" />
          <Point>{POINT_SYSTEM_PLUS.LIKE.value} 포인트</Point>
        </Item>
        <Item>
          <Name>에타 홍보</Name>
          <i className="fa-light fa-2x fa-gift" />
          <Point>{POINT_SYSTEM_PLUS.PROMOTION.value} 포인트</Point>
        </Item>
      </Layout>
      <UnorderedList mt="12px">
        <ListItem>
          <Box as="span" color="var(--color-orange)">
            출석과 모임
          </Box>
          은 포인트와 동아리 점수 모두 획득 !!
        </ListItem>
        <ListItem>포인트는 스토어에서 사용이 가능합니다.</ListItem>
        <ListItem>그 외 다양한 곳에서 포인트 획득이 가능합니다.</ListItem>
      </UnorderedList>
    </>
  );
}

const Layout = styled.div`
  margin-top: var(--gap-1);

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  > div:nth-child(-n + 3) {
    border-bottom: var(--border);
  }
  > div:nth-child(2),
  div:nth-child(5) {
    border-left: var(--border);
    border-right: var(--border);
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--gap-2);
`;

const Name = styled.span`
  margin-bottom: var(--gap-3);
`;

const Point = styled.span<{ isDoublePoint?: boolean }>`
  margin-top: var(--gap-2);
  color: ${(props) => (!props.isDoublePoint ? "var(--color-mint)" : "var(--color-orange)")};
`;

export default PointSystemsModalPoint;
