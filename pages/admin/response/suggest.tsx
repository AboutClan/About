import dayjs from "dayjs";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import Header from "../../../components/layouts/Header";
import AdminLocationSelector from "../../../components/molecules/picker/AdminLocationSelector";
import { useUserRequestQuery } from "../../../hooks/admin/quries";
import { IUserRequest } from "../../../types2/userTypes/userRequestTypes";

function AdminSuggest() {
  const [initialData, setInitialData] = useState<IUserRequest[]>();
  const [suggestData, setSuggestData] = useState<IUserRequest[]>();

  const { data: data1 } = useUserRequestQuery("건의");
  const { data: data2, isLoading } = useUserRequestQuery("신고");

  useEffect(() => {
<<<<<<< HEAD
    if (isLoading) return;
    setInitialData([...data1, ...data2]);
=======
    if (isLoading || !data1) return;
    const sortedData = [...data1, ...data2].sort((a, b) =>
      dayjs(a.createdAt) > dayjs(b.createdAt) ? 1 : -1
    );

    setInitialData(sortedData);
>>>>>>> main
  }, [data1, data2, isLoading]);

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
  margin: 0 var(--gap-4);
  margin-top: var(--gap-3);
`;

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
  justify-content: space-between;
  flex: 1;
  margin-top: 10px;
  > div {
    span {
      font-size: 10px;
      color: var(--gray-3);
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
  color: var(--gray-2);
  font-size: 13px;
  min-height: 48px;
  display: flex;
  align-items: center;
  margin-bottom: 6px;
`;

export default AdminSuggest;
