import { faArrowRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import styled from "styled-components";

import { MainLoading } from "../../components/atoms/loaders/MainLoading";
import Header from "../../components/layouts/Header";
import { usePointSystemLogQuery, usePointSystemQuery } from "../../hooks/user/queries";

function ScoreLog() {
  const { data: score } = usePointSystemQuery("score");
  const { data: scoreLog, isLoading } = usePointSystemLogQuery("score");

  const filterLog = scoreLog?.filter((item) => item.meta.value);

  return (
    <>
      <Header title="점수 로그" url="/point" />
      <Layout>
        <MyPoint>
          <span>내 점수</span>
          <FontAwesomeIcon icon={faArrowRight} />
          <span>{score}점</span>
        </MyPoint>
        <Container>
          <LogHeader>
            <Date>날짜</Date>
            <Content>내용</Content>
            <Point>점수</Point>
          </LogHeader>
          <>
            {!isLoading ? (
              filterLog.map((item, idx) => {
                const value = item?.meta.value;
                return (
                  <Item key={idx}>
                    <Date>{dayjs(item.timestamp).format("M.DD")}</Date>
                    <Content>{item.message}</Content>
                    <Point isMinus={value < 0}>
                      {value > 0 && "+"}
                      {value} 점
                    </Point>
                  </Item>
                );
              })
            ) : (
              <MainLoading />
            )}
          </>
        </Container>
      </Layout>
    </>
  );
}

const Layout = styled.div`
  margin: 0 var(--gap-4);
  margin-top: var(--gap-5);
  font-weight: 600;
`;

const LogHeader = styled.header`
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: var(--border);
  font-size: 13px;
  > span {
    text-align: center;
  }
  > span:first-child {
    color: var(--gray-900);
  }
  > span:last-child {
    padding-left: var(--gap-1);
  }
`;

const MyPoint = styled.div`
  padding: 0 var(--gap-2);
  display: flex;
  justify-content: space-around;
  padding: 0 var(--gap-3);
  align-items: center;
  width: 160px;
  height: 40px;
  border-radius: var(--rounded-lg);
  border: var(--border-mint);
  color: var(--gray-800);
  font-size: 14px;
  > span:first-child {
    flex: 1;
  }
  > span:last-child {
    flex: 1;
    text-align: end;
    font-size: 15px;
    color: var(--gray-900);
    font-weight: 700;
  }
`;

const Container = styled.div`
  margin-top: var(--gap-5);
  display: flex;
  flex-direction: column;
`;
const Item = styled.div`
  color: var(--gray-900);
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: var(--border);
  font-size: 12px;
`;

const Date = styled.span`
  color: var(--gray-700);
  margin-right: var(--gap-4);
  width: 54px;
  text-align: center;
`;

const Content = styled.span`
  flex: 1;
`;

const Point = styled.span<{ isMinus?: boolean }>`
  width: 64px;
  text-align: center;
  color: ${(props) => (props.isMinus ? "var(--color-red)" : "var(--gray-900)")};
`;
export default ScoreLog;
