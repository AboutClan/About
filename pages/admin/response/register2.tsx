/* eslint-disable */

import dayjs from "dayjs";
import styled from "styled-components";
import Header from "@/components/layouts/Header";
import { CopyBtn } from "@/components/Icons/CopyIcon";
import { useUserRegisterFormsQuery } from "@/features/admin/hooks/quries";
import { IUserRegisterForm } from "@/types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "@/utils/dateTimeUtils";
import { safeDecodeTel } from "@/utils/utils";

const START_DATETIME = "2026-07-28 16:30";
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
    applyData
      ?.filter((who) => {
        const isAfterStart = !dayjs(who.updatedAt).isBefore(dayjs(START_DATETIME));
        const birthYear = getBirthYear(who.birth);
        const isYoungerThanMinBirthYear = birthYear !== null && birthYear > MIN_BIRTH_YEAR;

        return isAfterStart && isYoungerThanMinBirthYear;
      })
      .map((who) => ({ ...who, telephone: safeDecodeTel(who.telephone) })) ?? [];

  const getContacts = (gender: IUserRegisterForm["gender"]) =>
    filteredData
      .filter((who) => who.gender === gender)
      .map((who) => who.telephone)
      .filter(Boolean);

  const maleContacts = getContacts("남성");
  const femaleContacts = getContacts("여성");

  return (
    <>
      <Header title="연락처 일괄 조회" url="/admin" />
      <Layout>
        <TopBar>
          <span>
            총 {filteredData.length}명 (남 {maleContacts.length} / 여 {femaleContacts.length})
          </span>
          <CopyBtnGroup>
            {!!maleContacts.length && (
              <CopyBtn size="md" text={maleContacts.join("\n")} label="남성 전체 복사" />
            )}
            {!!femaleContacts.length && (
              <CopyBtn size="md" text={femaleContacts.join("\n")} label="여성 전체 복사" />
            )}
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
import { checkAdminAuth } from "@/libs/serverSideProps/adminAuth";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return checkAdminAuth(context);
};
