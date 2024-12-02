/* eslint-disable */

import { Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Avatar from "../../../components/atoms/Avatar";
import Header from "../../../components/layouts/Header";
import { useUserRegisterFormsQuery } from "../../../hooks/admin/quries";
import CheckRegisterModal from "../../../modals/admin/checkRegisterModal/CheckRegisterModal";
import { IUserRegisterForm } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

function AdminRegister() {
  const [isModal, setIsModal] = useState(false);
  const [applicant, setApplicant] = useState<IUserRegisterForm>();
  const [isRefetch, setIsRefetch] = useState(false);

  const { data: applyData, refetch } = useUserRegisterFormsQuery();

  const onClick = (who?: IUserRegisterForm) => {
    setApplicant(who);
    setIsModal(true);
  };

  useEffect(() => {}, []);

  useEffect(() => {
    if (isRefetch)
      setTimeout(() => {
        refetch();
      }, 1000);
    setIsRefetch(false);
  }, [isRefetch, refetch]);

  return (
    <>
      <Header title="가입 신청 확인" url="/admin" />
      <Layout>
        {/* <AdminLocationSelector
          initialData={applyData}
          setRequestData={setRegisterData}
          type="register"
        /> */}
        <Main>
          {applyData?.map((who, idx) => (
            <Item key={idx}>
              <Avatar uid={who.uid} image={who.profileImage} size="md" />
              <Summary>
                <div>
                  <span>{who?.name}</span>
                  <span>{dayjsToFormat(dayjs(who.updatedAt), "YY-MM-DD / HH:mm 신청")}</span>
                </div>
                <span>{who?.location}</span>
              </Summary>
              <Button
                color="white"
                backgroundColor="var(--color-mint)"
                size="sm"
                onClick={() => onClick(who)}
              >
                신청보기
              </Button>
            </Item>
          ))}
        </Main>
      </Layout>
      {isModal && applicant && (
        <CheckRegisterModal
          setIsModal={setIsModal}
          applicant={applicant}
          setIsRefetch={setIsRefetch}
        />
      )}
    </>
  );
}

const Layout = styled.div`
  padding: 14px;
`;



const Main = styled.main`
  display: flex;
  flex-direction: column;
  margin-top: 14px;
  > div:first-child {
    border-top: 1px solid var(--gray-400);
  }
`;

const Item = styled.div`
  height: 72px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px solid var(--gray-400);
`;

const Summary = styled.div`
  flex: 1;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > div {
    display: flex;
    flex-direction: column;
    > span:first-child {
      font-weight: 600;
      font-size: 13px;
    }
    > span:last-child {
      font-size: 11px;
      color: var(--gray-600);
    }
  }
  > span {
    margin-right: 12px;
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-700);
  }
`;

const Profile = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 19px;
  overflow: hidden;
`;

export default AdminRegister;
