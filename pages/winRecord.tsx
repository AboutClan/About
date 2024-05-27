import dayjs from "dayjs";
import styled from "styled-components";

import Header from "../components/layouts/Header";
import Slide from "../components/layouts/PageSlide";
import { WIN_RECORD } from "../storage/winRecord";

function WinRecord() {
  return (
    <>
      <Header title="당첨자 로그" />
      <Slide>
        <Layout>
          <Container>
            <LogHeader>
              <Date>날짜</Date>
              <Content>당첨 선물</Content>
              <Point>당첨자</Point>
            </LogHeader>
            <>
              {WIN_RECORD.slice()
                .reverse()
                .map((item, idx) => (
                  <Item key={idx}>
                    <Date>{dayjs(item.date).format("M.DD")}</Date>
                    <Content>{item.present}</Content>
                    <Point>
                      {item.name} <i className="fa-light fa-sm fa-circle" />
                    </Point>
                  </Item>
                ))}
            </>
          </Container>
        </Layout>
      </Slide>
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
  margin-right: var(--gap-4);
  width: 54px;
  text-align: center;
`;

const Content = styled.span`
  flex: 1;
`;

const Point = styled.span`
  width: 64px;
  text-align: center;
`;

export default WinRecord;
