import "react-datepicker/dist/react-datepicker.css";

import { Box, Button } from "@chakra-ui/react";
import KoreanLocale from "date-fns/locale/ko"; // 한국어 로케일 추가
import dayjs from "dayjs";
import { KakaoProfile } from "next-auth/providers/kakao";
import { useSearchParams } from "next/navigation";
import { forwardRef, useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import styled from "styled-components";

import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import { useUserKakaoInfoQuery } from "../../hooks/user/queries";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { IUser, IUserRegisterFormWriting } from "../../types/models/userTypes/userInfoTypes";
import { birthToAge } from "../../utils/convertUtils/convertTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

registerLocale("ko", KoreanLocale);

function Birthday() {

  const info: IUserRegisterFormWriting = getLocalStorageObj(REGISTER_INFO);

  const getBirth = (birth: string) => {
    const defaultBirth =
      Number(birth?.slice(0, 2)) < 50 ? "20" + birth : birth ? "19" + birth : null;
    return new Date(
      +defaultBirth?.slice(0, 4),
      +defaultBirth?.slice(4, 6) - 1,
      +defaultBirth?.slice(6),
    );
  };

  const { data, type } = useUserKakaoInfoQuery();

  const [errorMessage, setErrorMessage] = useState("");
  const [birthday, setBirthday] = useState(getBirth(info?.birth || "010101"));

  useEffect(() => {
    if (info?.birth || !data) return;
    if (type === "kakao") {
      const kakaoData = data as KakaoProfile["kakao_account"];
      if (kakaoData?.birthday && kakaoData?.birthyear) {
        const birth = kakaoData.birthyear.slice(2) + kakaoData.birthday;
        setBirthday(getBirth(birth));
      }
    } else {
      setBirthday(getBirth((data as IUser)?.birth || "010101"));
    }
  }, [data]);

  const onClickNext = (e) => {
    const age = birthToAge(dayjs(birthday).format("YYMMDD"));

    if (dayjs(birthday).year() > dayjs().year() - 19) {
      setErrorMessage("죄송합니다. 만 19 ~ 28세의 인원만 가입이 가능합니다.");
      e.preventDefault();
      return;
    }

    if (age > 28) {
      setErrorMessage("죄송합니다. 만 19 ~ 28세의 인원만 가입이 가능합니다.");
      e.preventDefault();
      return;
    }

    setLocalStorageObj(REGISTER_INFO, {
      ...info,
      birth: dayjs(birthday).format("YYMMDD"),
    });
  };

  const myBirth = dayjs(birthday).format("YYYY년 M월 D일");

  const CustomButton = forwardRef<HTMLButtonElement, { value: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => {
      return (
        <Button
          ref={ref}
          _focus={{ bg: "inherit" }}
          _hover={{ bg: "inherit" }}
          color="white"
          bg="inherit"
          size="md"
          onClick={onClick}
          w="160px"
        >
          {value}
        </Button>
      );
    },
  );
  CustomButton.displayName = "CustomButton";

  return (
    <>
      <ProgressHeader title={"회원가입"} value={30} />
      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>생년월일을 입력해 주세요</span>
          <span>20대 초반부터 중후반까지, 많은 멤버들이 활동하고 있어요!</span>
        </RegisterOverview>
        <DateContainer>
          <Box
            borderBottom="1.5px solid var(--gray-500)"
            px={5}
            pb={0.5}
            fontSize="28px"
            mb={6}
            fontWeight="bold"
          >
            {myBirth}
          </Box>
          <Button
            mt={1}
            px={0}
            borderRadius="8px"
            size="md"
            as="div"
            bg="gray.800"
            border="var(--border-main)"
            _focus={{ bg: "var(--gray-500)" }}
            _hover={{ bg: "var(--gray-500)" }}
          >
            <StyledDatePicker
              locale="ko"
              selected={birthday}
              onChange={(date) => {
                setBirthday(date as Date);
              }}
              dateFormat="출생연도 / 월 선택"
              showMonthYearPicker
              onFocus={(e) => {
                e.target.blur();
              }}
              customInput={<CustomButton value="연도 / 월 선택" />}
            />
          </Button>
          <Button
            size="md"
            borderRadius="8px"
            px={0}
            mt={3}
            as="div"
            w="160px"
            bgColor="gray.800"
            border="var(--border-main)"
            _focus={{ bg: "var(--gray-500)" }}
            _hover={{ bg: "var(--gray-500)" }}
          >
            <StyledDatePicker
              locale="ko"
              selected={birthday}
              onChange={(date) => setBirthday(date as Date)}
              dateFormat="날짜 선택"
              onFocus={(e) => e.target.blur()}
              customInput={<CustomButton value="날짜 선택" />}
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
      <BottomNav onClick={onClickNext} url="/register/location" />
    </>
  );
}

const StyledDatePicker = styled(DatePicker)`
  text-align: center;
  background-color: inherit;
  font-size: 16px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-700);
  outline: none;
`;

const DateContainer = styled.div`
  margin-bottom: var(--gap-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: apple;

  .react-datepicker {
    font-family: apple;
  }
  .react-datepicker__header {
    font-size: 14px;
  }
  .react-datepicker__month {
    margin: 4px;
  }

  .react-datepicker__month-text {
    width: 80px;
    height: 40px;
    padding: 14px 0;
  }
  .react-datepicker__day-name {
    font-weight: 400;
    font-size: 12px;
    margin: 2px 4px;
  }
  .react-datepicker__day {
    font-weight: 400;
    width: 30px;
    height: 30px;
    padding-top: 4px;
  }
`;

export default Birthday;
