import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";
import { useStudyArrivedCntQuery } from "../../../hooks/study/queries";
interface IRecordDetailOverview {}

function RecordDetailOverview({}: IRecordDetailOverview) {
  const { data: session } = useSession();

  const [isFirst, setIsFirst] = useState();

  //   const {data}=useStudyCheckRecordsQuery();
  const { data: myArrivedCnt, isLoading } = useStudyArrivedCntQuery();
  return (
    <>
      {!isLoading && (
        <Layout>
          <Container>
            <Title>
              {isFirst ? `${dayjs().month() + 1}월 참여` : "전체 참여"}
            </Title>
            <Value>{isFirst ? 22 : myArrivedCnt[session?.uid as string]}</Value>
            <ChangeBtn>전환</ChangeBtn>
          </Container>
        </Layout>
      )}
    </>
  );
}

const Layout = styled.div`
  height: 160px;
  background-color: var(--color-mint);
  color: white;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.span``;

const Value = styled.span``;

const ChangeBtn = styled.button``;

export default RecordDetailOverview;
