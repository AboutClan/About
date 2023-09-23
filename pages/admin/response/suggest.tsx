import dayjs from "dayjs";
import { useState } from "react";
import styled from "styled-components";
import { MainLoading } from "../../../components/common/loaders/MainLoading";
import Header from "../../../components/layout/Header";
import AdminLocationSelector from "../../../components/pages/AdminLocationSelector";
import { useUserRequestQuery } from "../../../hooks/user/queries";
import { IUserRequest } from "../../../types/user/userRequest";

function AdminSuggest() {
  const [initialData, setInitialData] = useState<IUserRequest[]>();
  const [suggestData, setSuggestData] = useState<IUserRequest[]>();

  const { isLoading } = useUserRequestQuery({
    onSuccess(data) {
      setInitialData(
        data.filter((item) => item.category === ("건의" || "신고"))
      );
    },
  });

  return (
    <>
      <Header title="건의사항 확인" url="/admin" />
      {isLoading ? (
        <MainLoading />
      ) : (
        <Layout>
          <Nav>
            <AdminLocationSelector
              initialData={initialData}
              setRequestData={setSuggestData}
              type="request"
            />
          </Nav>
          {suggestData
            ?.slice()
            .reverse()
            .map((item, idx) => (
              <Item key={idx}>
                <Wrapper>
                  <ItemHeader>
                    <Title>{item?.title}</Title>
                    <div>
                      <span>{item.writer || "익명"}</span>
                      <span>{dayjs(item.updatedAt).format("M월 D일")}</span>
                    </div>
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

const Nav = styled.nav`
  margin: 0 var(--margin-main);
  margin-top: var(--margin-sub);
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;

  border-bottom: 6px solid var(--font-h6);
  padding: 16px 0;
`;
const Wrapper = styled.div`
  padding: 0 16px;
`;
const ItemHeader = styled.header`
  min-height: 30px;
  display: flex;
  justify-content: space-between;
  flex: 1;
  margin-top: 10px;
  > div {
    span {
      font-size: 10px;
      color: var(--font-h3);
      margin-left: 8px;
    }
  }
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  width: 240px;
`;

const Content = styled.div`
  padding: 8px 0;
  color: var(--font-h2);
  font-size: 13px;
  min-height: 48px;
  display: flex;
  align-items: center;
  margin-bottom: 6px;
`;

export default AdminSuggest;