import styled from "styled-components";
import Header from "../../components/layouts/Header";
import { MainLoading } from "../../components/ui/MainLoading";
import { useUserRequestQuery } from "../../hooks/userRequest/queries";

function CheckPromotion() {
  const { data, isLoading } = useUserRequestQuery();
  const suggestData = data?.filter((item) => item.category === "홍보");

  return (
    <>
      <Header title="홍보현황 확인" url="/admin" />
      {isLoading ? (
        <MainLoading />
      ) : (
        <Layout>
          {suggestData
            ?.slice()
            .reverse()
            .map((item, idx) => (
              <Item key={idx}>
                <span>{item?.writer}</span>
                <span>2022-05-03</span>
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
  border-bottom: 1px solid var(--font-h5);
  > span {
    margin-right: 12px;
  }
`;

export default CheckPromotion;