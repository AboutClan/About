import dayjs from "dayjs";
import styled from "styled-components";

import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import Header from "../../../components/layouts/Header";
import { useUserRequestQuery } from "../../../hooks/admin/quries";

function CheckAttendWinner() {
  const { data, isLoading } = useUserRequestQuery("출석");

  return (
    <>
      <Header title="출석체크 당첨자" url="/admin" />
      {isLoading ? (
        <MainLoading />
      ) : (
        <Layout>
          {data
            ?.slice()
            .reverse()
            .map((item, idx) => (
              <Item key={idx}>
                <Wrapper>
                  <ItemHeader>
                    <span>{item.writer || "익명"}</span>
                    <span>{dayjs(item.updatedAt).format("M월 D일 H시 m분")}</span>
                  </ItemHeader>
                  <Content>{item.content}</Content>
                </Wrapper>
              </Item>
            ))}
        </Layout>
      )}
    </>
  );
}

const Layout = styled.div``;

const Item = styled.div`
  display: flex;
  flex-direction: column;

  border-bottom: 6px solid var(--gray-6);
  padding: 16px 0;
`;
const Wrapper = styled.div`
  padding: 0 16px;
`;
const ItemHeader = styled.header`
  min-height: 30px;
  display: flex;

  flex: 1;
  margin-top: var(--gap-2);

  color: var(--gray-2);

  span {
    font-size: 12px;
    color: var(--gray-3);
    margin-right: 8px;
  }
`;

const Content = styled.div`
  padding: var(--gap-2) 0;
  color: var(--gray-2);
  font-size: 13px;
  display: flex;
  align-items: center;
`;

export default CheckAttendWinner;
