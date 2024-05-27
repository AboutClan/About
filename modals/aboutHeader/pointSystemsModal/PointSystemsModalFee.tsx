import { ListItem, UnorderedList } from "@chakra-ui/react";
import styled from "styled-components";

import { POINT_SYSTEM_DEPOSIT } from "../../../constants/settingValue/pointSystem";

function PointSystemsModalFee() {
  return (
    <>
      <Layout>
        <Item>
          <Name>스터디 지각</Name>

          <i className="fa-light fa-2x fa-alarm-clock" />
          <Point>{POINT_SYSTEM_DEPOSIT.STUDY_ATTEND_LATE.value}원</Point>
        </Item>
        <Item>
          <Name>당일 불참 1</Name>

          <i className="fa-light fa-2x fa-do-not-enter" />
          <Point>{POINT_SYSTEM_DEPOSIT.STUDY_ABSENT_BEFORE.value}원</Point>
        </Item>
        <Item>
          <Name>당일 불참 2</Name>

          <i className="fa-light fa-2x fa-circle-x-mark" />
          <Point>{POINT_SYSTEM_DEPOSIT.STUDY_ABSENT_AFTER.value}원</Point>
        </Item>
        <Item>
          <Name>한달 정산</Name>

          <i className="fa-light fa-2x fa-calendar-x-mark" />
          <Point>{POINT_SYSTEM_DEPOSIT.STUDY_MONTH_CALCULATE.value}원</Point>
        </Item>
        <Item>
          <Name>규칙</Name>

          <i className="fa-light fa-2x fa-scale-balanced" />
          <Point>OUT</Point>
        </Item>
        <Item>
          <Name>운영진 경고</Name>

          <i className="fa-light fa-2x fa-user-pilot" />
          <Point>OUT</Point>
        </Item>
      </Layout>
      <UnorderedList mt="12px">
        <ListItem>스터디 지각은 1시간 기준입니다.</ListItem>
        <ListItem>한 달에 1회 이상 스터디 참여 필수입니다.</ListItem>
      </UnorderedList>
    </>
  );
}

const Layout = styled.div`
  margin-top: var(--gap-1);
  display: grid;
  color: var(--gray-2);
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
  color: var(--color-red);
`;

export default PointSystemsModalFee;
