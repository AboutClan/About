/* eslint-disable */

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import Header from "../../../components/layouts/Header";
import AdminLocationSelector from "../../../components/molecules/picker/AdminLocationSelector";
import { useUserRequestQuery } from "../../../hooks/admin/quries";
import { IUserRequest } from "../../../types/models/userTypes/userRequestTypes";
import { getRestInfo } from "../../../utils/convertUtils/convertDatas";

function AdminRest() {
  const [initialData, setInitialData] = useState<IUserRequest[]>();
  const [suggestData, setSuggestData] = useState<IUserRequest[]>();
  const { data, isLoading } = useUserRequestQuery("휴식");

  useEffect(() => {
    if (data) setInitialData(data);
  }, [data]);

  return (
    <>
      <Header title="휴식신청 확인" url="/admin" />
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
            .map((item, idx) => {
              const { type, date, content } = getRestInfo(item?.content);

              return (
                <Item key={idx}>
                  <div>
                    <span>이름:</span>
                    <span>temp</span>
                  </div>
                  <div>
                    <span>날짜:</span>
                    <span>{dayjs(item.updatedAt).format("YYYY-MM-DD")} </span>
                  </div>
                  <div>
                    <span>종류:</span>
                    <span>{type}</span>
                  </div>
                  <div>
                    <span>기간:</span>
                    <span>{date}</span>
                  </div>
                  <div>
                    <span>내용:</span>
                    <span>{content} </span>
                  </div>
                </Item>
              );
            })}
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

  border-bottom: 8px solid var(--gray-200);
  padding: var(--gap-3) var(--gap-4);
  font-size: 13px;
  color: var(--gray-700);
  > div {
    > span:first-child {
      font-weight: 600;
      margin-right: var(--gap-3);
    }
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  > span:first-child {
    font-size: 14px;
    font-weight: 600;
    margin-right: 12px;
  }
  > span:last-child {
    font-size: 11px;
    color: var(--gray-700);
  }
`;

export default AdminRest;
