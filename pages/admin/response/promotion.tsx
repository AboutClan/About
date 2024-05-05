import dayjs from "dayjs";
import styled from "styled-components";

import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import Header from "../../../components/layouts/Header";
import { useUserRequestQuery } from "../../../hooks/admin/quries";

function AdminPromotion() {
  const { data, isLoading } = useUserRequestQuery("홍보");

  return (
    <>
      <Header title="홍보기록 확인" url="/admin" />
      {isLoading ? (
        <MainLoading />
      ) : (
        <Layout>
          {data
            ?.slice()
            .reverse()
            .map((item, idx) => (
              <Item key={idx}>
                <span>{item?.writer}</span>
                <span>{dayjs(item?.updatedAt).format("YYYY-MM-DD")}</span>
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
  padding: 12px;
  border-bottom: 1px solid var(--gray-5);
  > span {
    margin-right: 12px;
  }
`;

export default AdminPromotion;
