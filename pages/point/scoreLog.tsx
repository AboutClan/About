import { faArrowRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import styled from "styled-components";
import Header from "../../components/layout/Header";
import {
  useScoreLogQuery,
  useScoreQuery,
} from "../../hooks/user/pointSystem/queries";

function ScoreLog() {
  const { data } = useScoreQuery();
  const { data: scoreLog } = useScoreLogQuery();

  const filterLog = scoreLog?.filter((item) => item.meta.value);

  return (
    <>
      <Header title="점수 로그" url="/point" />
      <Layout>
        <MyPoint>
          <span>내 점수</span>
          <FontAwesomeIcon icon={faArrowRight} />
          <span>{data?.score}점</span>
        </MyPoint>
        <Container>
          <LogHeader>
            <Date>날짜</Date>
            <Content>내용</Content>
            <Point>점수</Point>
          </LogHeader>
          {filterLog?.reverse().map((item, idx) => {
            const value = item?.meta.value;
            return (
              <Item key={idx}>
                <Date>{dayjs(item?.timestamp).format("M.DD")}</Date>
                <Content>{item?.message}</Content>
                <Point isMinus={value < 0}>
                  {value > 0 && "+"}
                  {value} 점
                </Point>
              </Item>
            );
          })}
        </Container>
      </Layout>
    </>
  );
}

const Layout = styled.div`
  margin: 0 var(--margin-main);
  margin-top: var(--margin-max);
  font-weight: 600;
`;

const LogHeader = styled.header`
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: var(--border-sub);
  font-size: 13px;
  > span {
    text-align: center;
  }
  > span:first-child {
    color: var(--font-h1);
  }
  > span:last-child {
    padding-left: var(--padding-min);
  }
`;

const MyPoint = styled.div`
  padding: 0 var(--padding-md);
  display: flex;
  justify-content: space-around;
  padding: 0 var(--padding-sub);
  align-items: center;
  width: 160px;
  height: 40px;
  border-radius: var(--border-radius-sub);
  border: var(--border-mint);
  color: var(--font-h2);
  font-size: 14px;
  > span:first-child {
    flex: 1;
  }
  > span:last-child {
    flex: 1;
    text-align: end;
    font-size: 15px;
    color: var(--font-h1);
    font-weight: 700;
  }
`;

const Container = styled.div`
  margin-top: var(--margin-max);
  display: flex;
  flex-direction: column;
`;
const Item = styled.div`
  color: var(--font-h1);
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: var(--border-sub);
  font-size: 12px;
`;

const Date = styled.span`
  color: var(--font-h3);
  margin-right: var(--margin-main);
  width: 54px;
  text-align: center;
`;

const Content = styled.span`
  flex: 1;
`;

const Point = styled.span<{ isMinus?: boolean }>`
  width: 64px;
  text-align: center;
  color: ${(props) => (props.isMinus ? "var(--color-red)" : "var(--font-h1)")};
`;
export default ScoreLog;
