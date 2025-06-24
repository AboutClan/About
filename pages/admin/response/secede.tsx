import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import { CopyBtn } from "../../../components/Icons/CopyIcon";
import Header from "../../../components/layouts/Header";
import AdminLocationSelector from "../../../components/molecules/picker/AdminLocationSelector";
import { useUserRequestQuery } from "../../../hooks/admin/quries";
import { usePointCuoponLogQuery } from "../../../hooks/user/queries";
import { IUserRequest } from "../../../types/models/userTypes/userRequestTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

function AdminSecede() {
  const [initialData, setInitialData] = useState<IUserRequest[]>();
  const [suggestData, setSuggestData] = useState<IUserRequest[]>();

  const { data, isLoading } = useUserRequestQuery("탈퇴");
  const { data: data2 } = usePointCuoponLogQuery("all");
  console.log(24, data2);

  console.log(data);
  useEffect(() => {
    if (data) setInitialData(data);
  }, [data]);

  return (
    <>
      <Header title="탈퇴신청 확인" url="/admin" />
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
                    <Title>
                      <div>
                        <span>{item?.writer?.name} / </span>
                        <span>
                          쿠폰:{" "}
                          {data2?.map((data) => data?.meta?.uid).includes(item?.writer?.uid)
                            ? "o"
                            : "x"}{" "}
                          /{" "}
                        </span>
                        <span>{item?.writer?.registerDate} / </span>
                        <span>소개: {item?.writer?.introduceText ? "o" : "x"} / </span>
                        <span>{item?.writer?.point} /</span>
                        <span>{dayjsToStr(dayjs(item?.createdAt))}</span>
                      </div>
                    </Title>
                  </ItemHeader>
                  <Content>
                    <CopyBtn text={item.content} />
                    <Box ml={2}>{item.content}</Box>
                  </Content>
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

  border-bottom: 6px solid var(--gray-300);
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
      color: var(--gray-600);
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
  color: var(--gray-700);
  font-size: 13px;
  min-height: 48px;
  display: flex;
  align-items: center;
  margin-bottom: 6px;
`;

export default AdminSecede;
