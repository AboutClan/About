import { Button } from "@chakra-ui/react";
import styled from "styled-components";

import Skeleton from "../../../components/atoms/skeleton/Skeleton";

function RecordOverviewSkeleton() {
  return (
    <Layout>
      <MyRecord>
        <MyRecordItem>
          <div>
            <ContentName>스터디 오픈</ContentName>
            <ContentValue>
              <Skeleton>temp</Skeleton>
            </ContentValue>
          </div>
          <div>
            <ContentName>참여한 인원</ContentName>
            <ContentValue>
              <Skeleton>temp</Skeleton>
            </ContentValue>
          </div>
        </MyRecordItem>
        <MyRecordItem>
          <div>
            <ContentName>내 참여 횟수</ContentName>
            <ContentValue>
              <Skeleton>temp</Skeleton>
            </ContentValue>
          </div>
          <div>
            <ContentName>내 최근 참여</ContentName>
            <ContentValue>
              <Skeleton>temp</Skeleton>
            </ContentValue>
          </div>
        </MyRecordItem>
      </MyRecord>
      <Button>분석</Button>
    </Layout>
  );
}

const Layout = styled.div`
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
`;

const MyRecord = styled.div`
  display: flex;
  height: 100%;
  > div:first-child {
    width: 125px;
  }
  > div:last-child {
    width: 140px;
  }
`;

const MyRecordItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;

  margin-bottom: 6px;

  > div {
    display: flex;
    align-items: center;
  }
`;
const ContentName = styled.span`
  margin-right: 6px;
  color: var(--gray-600);
  font-size: 13px;
`;

const ContentValue = styled.span`
  display: inline-block;
  width: 40px;
  font-weight: 700;
  font-size: 14px;
  color: var(--gray-200);
`;
export default RecordOverviewSkeleton;
