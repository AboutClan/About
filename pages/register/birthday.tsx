import "react-datepicker/dist/react-datepicker.css";

import { Box, Button } from "@chakra-ui/react";
import KoreanLocale from "date-fns/locale/ko";
import dayjs from "dayjs";
import { KakaoProfile } from "next-auth/providers/kakao";
import { forwardRef, useEffect, useMemo, useState } from "react";
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
  const { data, type } = useUserKakaoInfoQuery();

  const [isClient, setIsClient] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [info, setInfo] = useState<IUserRegisterFormWriting | null>(null);

  const getBirth = (birth: string) => {
    const defaultBirth =
      Number(birth?.slice(0, 2)) < 50 ? "20" + birth : birth ? "19" + birth : null;

    return new Date(
      +defaultBirth?.slice(0, 4),
      +defaultBirth?.slice(4, 6) - 1,
      +defaultBirth?.slice(6),
    );
  };

  // ✅ 마운트 이후에만 localStorage 읽기 (hydration 방지)
  useEffect(() => {
    setIsClient(true);

    const stored: IUserRegisterFormWriting = getLocalStorageObj(REGISTER_INFO);
    setInfo(stored);

    // 기존과 동일: info.birth 있으면 그걸로, 없으면 010101 기본값
    setBirthday(getBirth(stored?.birth || "010101"));
  }, []);

  // ✅ 기존 로직 동일: info.birth가 없을 때만 카카오/유저 데이터로 birthday 채움
  useEffect(() => {
    if (!isClient) return;
    if (!birthday) return;
    if (!data) return;
    if (info?.birth) return;

    if (type === "kakao") {
      const kakaoData = data as KakaoProfile["kakao_account"];
      if (kakaoData?.birthday && kakaoData?.birthyear) {
        const birth = kakaoData.birthyear.slice(2) + kakaoData.birthday;
        setBirthday(getBirth(birth));
      }
    } else {
      setBirthday(getBirth((data as IUser)?.birth || "010101"));
    }
  }, [isClient, data, type, info?.birth, birthday]);

  const onClickNext = (e: any) => {
    if (!birthday) {
      e?.preventDefault?.();
      return;
    }

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

    const stored: IUserRegisterFormWriting = info ?? getLocalStorageObj(REGISTER_INFO);

    setLocalStorageObj(REGISTER_INFO, {
      ...stored,
      birth: dayjs(birthday).format("YYMMDD"),
    });
  };

  const myBirth = useMemo(() => {
    if (!birthday) return "—";
    return dayjs(birthday).format("YYYY년 M월 D일");
  }, [birthday]);

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
      <ProgressHeader title="회원가입" value={30} />
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
            {/* ✅ birthday 준비되기 전엔 렌더 안 함 (hydration 안정) */}
            {birthday && (
              <StyledDatePicker
                locale="ko"
                selected={birthday}
                onChange={(date) => setBirthday(date as Date)}
                dateFormat="출생연도 / 월 선택"
                showMonthYearPicker
                onFocus={(e) => e.target.blur()}
                customInput={<CustomButton value="연도 / 월 선택" />}
              />
            )}
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
            {birthday && (
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
                    <span>{dayjs(date).format("YYYY년 M월 D일")}</span>
                  </div>
                )}
              />
            )}
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

  /* ✅ 연/월 선택 상단 화살표(삼각형) 색 + 크기 */
  .react-datepicker__navigation-icon::before {
    border-color: var(--gray-800);
    border-width: 1.5px 1.5px 0 0;
    width: 5px;
    height: 5px;
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
