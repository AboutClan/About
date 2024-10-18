import "react-datepicker/dist/react-datepicker.css";

import { Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import DatePicker from "react-datepicker";
import styled from "styled-components";

import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { IUserRegisterFormWriting } from "../../types/models/userTypes/userInfoTypes";
import { birthToAge } from "../../utils/convertUtils/convertTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

function Birthday() {
  const searchParams = useSearchParams();
  const info: IUserRegisterFormWriting = getLocalStorageObj(REGISTER_INFO);

  const [errorMessage, setErrorMessage] = useState("");

  const initialDate = new Date(2000, 0, 1);

  const birth = info?.birth;

  const defaultBirth =
    birth && Number(birth?.slice(0, 2)) < 50 ? "20" + birth : birth ? "19" + birth : null;

  const defaultBirthDate =
    defaultBirth &&
    new Date(+defaultBirth?.slice(0, 4), +defaultBirth?.slice(4, 6) - 1, +defaultBirth?.slice(6));
  const isProfileEdit = !!searchParams.get("edit");
  const [startDate, setStartDate] = useState(defaultBirthDate || initialDate);

  const onClickNext = (e) => {
    const age = birthToAge(dayjs(startDate).format("YYMMDD"));

    if (age < 19 || age > 26) {
      setErrorMessage("죄송합니다. 19 ~ 26세의 인원만 가입이 가능합니다.");
      e.preventDefault();
      return;
    }

    if (dayjs(startDate)) {
      setLocalStorageObj(REGISTER_INFO, {
        ...info,
        birth: dayjs(startDate).format("YYMMDD"),
      });
    }
  };

  const myBirth = dayjs(startDate).format("YYYY년 M월 D일");

  return (
    <>
      <ProgressHeader title={!isProfileEdit ? "회원가입" : "프로필 수정"} value={40} />

      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>생년월일을 입력해 주세요</span>
          <span>만 19세 ~ 만 26세의 인원만 가입할 수 있습니다!</span>
        </RegisterOverview>
        <DateContainer>
          <DateStr>{myBirth}</DateStr>
          <Button size="md" as="div" bgColor="white" border="var(--border-main)">
            <StyledDatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date as Date)}
              dateFormat="연도 / 월 선택"
              showMonthYearPicker
              onFocus={(e) => e.target.blur()}
            />
          </Button>
          <Button size="md" mt="10px" as="div" bgColor="white" border="var(--border-main)">
            <StyledDatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date as Date)}
              dateFormat="날짜 선택"
              onFocus={(e) => e.target.blur()}
              renderCustomHeader={({ date }) => (
                <div
                  style={{
                    margin: 10,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <span>{dayjs(date)?.format("YYYY년 M월 D일")}</span>
                </div>
              )}
            />
          </Button>
        </DateContainer>
      </RegisterLayout>
      <BottomNav onClick={onClickNext} url="/register/mbti" />
    </>
  );
}

const StyledDatePicker = styled(DatePicker)`
  text-align: center;
  background-color: inherit;
  font-size: 16px;
  width: 160px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-700);
  outline: none;
`;

const DateStr = styled.div`
  font-size: 24px;
  margin: var(--gap-5) 0;
`;

const DateContainer = styled.div`
  margin-bottom: var(--gap-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  .react-datepicker__header {
    font-size: 14px;
  }
  .react-datepicker__month-text {
    width: 80px;
    height: 40px;
    padding: 14px 0;
  }
  .react-datepicker__day-name {
    font-weight: 400;
    font-size: 12px;
    margin: 4px 5.5px;
    margin-top: 8px;
  }
  .react-datepicker__day {
    font-weight: 400;
    width: 30px;
    height: 30px;
    padding-top: 4px;
  }
`;

export default Birthday;
