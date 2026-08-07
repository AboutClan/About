/* eslint-disable */

import dayjs from "dayjs";
import styled from "styled-components";
import Header from "../../../components/layouts/Header";
import { CopyBtn } from "../../../components/Icons/CopyIcon";
import { useUserRegisterFormsQuery } from "../../../hooks/admin/quries";
import { IUserRegisterForm } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

const START_DATE = "2026-05-21";
const MIN_BIRTH_YEAR = 1997;

const getBirthYear = (birth: string) => {
  if (!birth) return null;
  const safe = birth.trim();

  if (/^\d{8}$/.test(safe)) return Number(safe.slice(0, 4));

  if (/^\d{6}$/.test(safe)) {
    const yy = Number(safe.slice(0, 2));
    return yy < 50 ? 2000 + yy : 1900 + yy;
  }

  return null;
};

function AdminRegister2() {
  const { data: applyData } = useUserRegisterFormsQuery();

  const filteredData =
    applyData?.filter((who) => {
      const isAfterStart = !dayjs(who.updatedAt).isBefore(dayjs(START_DATE), "day");
      const birthYear = getBirthYear(who.birth);
      const isYoungerThanMinBirthYear = birthYear !== null && birthYear > MIN_BIRTH_YEAR;

      return isAfterStart && isYoungerThanMinBirthYear;
    }) ?? [];

  const maleContacts = filteredData
    .filter((who) => who.gender === "남성")
    .map((who) => who.telephone)
    .filter(Boolean)
    .join("\n");

  const femaleContacts = filteredData
    .filter((who) => who.gender === "여성")
    .map((who) => who.telephone)
    .filter(Boolean)
    .join("\n");

  return (
    <>
      <Header title="연락처 일괄 조회" url="/admin" />
      <Layout>
        <TopBar>
          <span>총 {filteredData.length}명</span>
          <CopyBtnGroup>
            {maleContacts && <CopyBtn size="md" text={maleContacts} label="남성 전체 복사" />}
            {femaleContacts && <CopyBtn size="md" text={femaleContacts} label="여성 전체 복사" />}
          </CopyBtnGroup>
        </TopBar>
        <Main>
          {filteredData.map((who, idx) => (
            <Item key={idx}>
              <div>
                <span>{who?.name}</span>
                <span>{dayjsToFormat(dayjs(who.updatedAt), "YY-MM-DD / HH:mm 신청")}</span>
              </div>
              <ContactWrapper>
                <span>{who?.telephone}</span>
                <CopyBtn text={who?.telephone} />
              </ContactWrapper>
            </Item>
          ))}
        </Main>
      </Layout>
    </>
  );
}

const Layout = styled.div`
  padding: 14px;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-700);
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

  > div:first-child {
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
`;

const CopyBtnGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gap-2);
`;

const ContactWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gap-2);
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-700);
`;

export default AdminRegister2;

import { GetServerSideProps } from "next";
import { checkAdminAuth } from "../../../libs/serverSideProps/adminAuth";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return checkAdminAuth(context);
};
