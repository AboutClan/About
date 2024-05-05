/* eslint-disable */

import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import ProfileIcon from "../../../components/atoms/Profile/ProfileIcon";
import Header from "../../../components/layouts/Header";
import AdminLocationSelector from "../../../components/molecules/picker/AdminLocationSelector";
import { useUserRegisterFormsQuery } from "../../../hooks/admin/quries";
import CheckRegisterModal from "../../../modals/admin/checkRegisterModal/CheckRegisterModal";
import { IUserRegisterForm } from "../../../types/models/userTypes/userInfoTypes";

function AdminRegister() {
  const [isModal, setIsModal] = useState(false);
  const [applicant, setApplicant] = useState<IUserRegisterForm>();
  const [isRefetch, setIsRefetch] = useState(false);
  const [registerData, setRegisterData] = useState<IUserRegisterForm[]>([]);

  const { data: applyData, refetch } = useUserRegisterFormsQuery();

  const onClick = (who?: IUserRegisterForm) => {
    setApplicant(who);
    setIsModal(true);
  };

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
        <AdminLocationSelector
          initialData={applyData}
          setRequestData={setRegisterData}
          type="register"
        />
        <Main>
          {registerData?.map((who, idx) => (
            <Item key={idx}>
              <ProfileIcon user={who} size="md" />
              <Summary>
                <div>
                  <span>{who?.name}</span>
                  <span>2023년 o월 oo일 신청</span>
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

const LocationFilter = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  margin-top: 14px;
  > div:first-child {
    border-top: 1px solid var(--gray-5);
  }
`;

const Item = styled.div`
  height: 72px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px solid var(--gray-5);
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
      color: var(--gray-3);
    }
  }
  > span {
    margin-right: 12px;
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-2);
  }
`;

const Profile = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 19px;
  overflow: hidden;
`;

export default AdminRegister;
