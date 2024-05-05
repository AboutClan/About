import { ListItem, UnorderedList } from "@chakra-ui/react";
import {
  faBadgeCheck,
  faCheckCircle,
  faCheckToSlot,
  faGift,
  faHeartCircle,
  faPartyHorn,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

import { POINT_SYSTEM_PLUS } from "../../../constants/settingValue/pointSystem";

function PointSystemsModalPoint() {
  return (
    <>
      <Layout>
        <Item>
          <Name>스터디 투표</Name>
          <FontAwesomeIcon size="2x" icon={faCheckToSlot} />
          <Point>0~20 POINT</Point>
        </Item>
        <Item>
          <Name>스터디 출석</Name>
          <FontAwesomeIcon size="2x" icon={faCheckCircle} />
          <Point>5 POINT</Point>
        </Item>
        <Item>
          <Name>에타 홍보</Name>
          <FontAwesomeIcon size="2x" icon={faGift} />
          <Point>{POINT_SYSTEM_PLUS.PROMOTION.value} POINT</Point>
        </Item>
        <Item>
          <Name>일일 출석</Name>
          <FontAwesomeIcon size="2x" icon={faBadgeCheck} />
          <Point>{POINT_SYSTEM_PLUS.DAILY_ATTEND.value} POINT</Point>
        </Item>
        <Item>
          <Name>좋아요</Name>
          <FontAwesomeIcon size="2x" icon={faHeartCircle} />
          <Point>{POINT_SYSTEM_PLUS.LIKE.value} POINT</Point>
        </Item>
        <Item>
          <Name>이벤트</Name>
          <FontAwesomeIcon size="2x" icon={faPartyHorn} />
          <Point>10 POINT</Point>
        </Item>
      </Layout>
      <UnorderedList mt="12px">
        <ListItem>이외에도 다양한 방식으로 획득이 가능합니다.</ListItem>
        <ListItem>포인트는 스토어에서 사용이 가능합니다.</ListItem>
      </UnorderedList>
    </>
  );
}

const Layout = styled.div`
  margin-top: var(--gap-1);
  color: var(--gray-2);
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

const Point = styled.span`
  margin-top: var(--gap-2);
  color: var(--color-mint);
`;

export default PointSystemsModalPoint;
