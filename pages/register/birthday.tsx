/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useUserInfoQuery } from "../../hooks/user/queries"; // 프로젝트 경로 기준
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

  // ✅ 기본값 정책: 값 없으면 2001-01-01
  const DEFAULT_BIRTHDAY = useMemo(() => new Date(2001, 0, 1), []);

  // ✅ DatePicker overlay 잔상(투명 레이어) 방지용 open 제어
  const [openMonth, setOpenMonth] = useState(false);
  const [openDay, setOpenDay] = useState(false);

  const closeAllPickers = () => {
    setOpenMonth(false);
    setOpenDay(false);
  };

  const parseBirthToDate = (birth: string): Date => {
    const safe = (birth || "").trim();

    // YYMMDD or YYYYMMDD only
    if (!/^\d{6}$|^\d{8}$/.test(safe)) return DEFAULT_BIRTHDAY;

    let y = 0;
    let m = 0;
    let d = 0;

    if (safe.length === 6) {
      // YYMMDD
      const yy = Number(safe.slice(0, 2));
      const yyyy = yy < 50 ? 2000 + yy : 1900 + yy; // 기존 의도 유지
      y = yyyy;
      m = Number(safe.slice(2, 4)) - 1;
      d = Number(safe.slice(4, 6));
    } else {
      // YYYYMMDD
      y = Number(safe.slice(0, 4));
      m = Number(safe.slice(4, 6)) - 1;
      d = Number(safe.slice(6, 8));
    }

    const dt = new Date(y, m, d);
    if (Number.isNaN(dt.getTime())) return DEFAULT_BIRTHDAY;

    // Date overflow 보정(예: 20240132 같은 값) 방지
    if (dt.getFullYear() !== y || dt.getMonth() !== m || dt.getDate() !== d)
      return DEFAULT_BIRTHDAY;

    return dt;
  };

  // ✅ 마운트 이후에만 localStorage 읽기 (hydration 방지)
  useEffect(() => {
    setIsClient(true);

    const stored: IUserRegisterFormWriting | null = getLocalStorageObj(REGISTER_INFO);

    setInfo(stored);

    // ✅ 기존과 동일: info.birth 있으면 그걸로, 없으면 기본값(2001-01-01)
    const initial = stored?.birth ? parseBirthToDate(stored.birth) : DEFAULT_BIRTHDAY;
    setBirthday(initial);
  }, [DEFAULT_BIRTHDAY]);

  // ✅ 기존 로직 동일: info.birth가 없을 때만 카카오/유저 데이터로 birthday 채움
  useEffect(() => {
    if (!isClient) return;
    if (!data) return;
    if (info?.birth) return;

    if (type === "kakao") {
      const kakaoData = data as KakaoProfile["kakao_account"];

      // ✅ 동의했을 때만 자동 조합, 아니면 기본값 유지
      if (kakaoData?.birthday && kakaoData?.birthyear) {
        const yymmdd = kakaoData.birthyear.slice(2) + kakaoData.birthday; // YYMMDD
        setBirthday(parseBirthToDate(yymmdd));
      } else {
        setBirthday(DEFAULT_BIRTHDAY);
      }
    } else if (type === "user") {
      const b = (data as IUser)?.birth;
      setBirthday(b ? parseBirthToDate(b) : DEFAULT_BIRTHDAY);
    } else {
      setBirthday(DEFAULT_BIRTHDAY);
    }
  }, [isClient, data, type, info?.birth, DEFAULT_BIRTHDAY]);

  // ✅ WebView/모바일에서 popper 잔상 방지: blur/visibility/resize/scroll 시 강제 close
  useEffect(() => {
    if (!isClient) return;

    const onBlur = () => closeAllPickers();
    const onVis = () => {
      if (document.visibilityState !== "visible") closeAllPickers();
    };
    const onResize = () => closeAllPickers();
    const onScroll = () => closeAllPickers();

    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isClient]);

  const onClickNext = (e: any) => {
    // ✅ 혹시 남아있는 overlay 방지
    closeAllPickers();

    if (!birthday) {
      e?.preventDefault?.();
      return;
    }

    const age = birthToAge(dayjs(birthday).format("YYMMDD"));

    if (dayjs(birthday).year() > dayjs().year() - 18) {
      setErrorMessage("죄송합니다. 만 18 ~ 28세의 인원만 가입이 가능합니다.");
      e?.preventDefault?.();
      return;
    }

    if (age > 28) {
      setErrorMessage("죄송합니다. 만 18 ~ 28세의 인원만 가입이 가능합니다.");
      e?.preventDefault?.();
      return;
    }

    const stored: IUserRegisterFormWriting | null = info ?? getLocalStorageObj(REGISTER_INFO);

    // ✅ stored가 null이어도 절대 터지지 않게
    setLocalStorageObj(REGISTER_INFO, {
      ...(stored ?? {}),
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
          type="button"
        >
          {value}
        </Button>
      );
    },
  );
  CustomButton.displayName = "CustomButton";

  // ✅ 이벤트/하이드레이션 꼬임 방지: 클라 준비 전엔 렌더하지 않음
  if (!isClient) return null;

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

          {/* ✅ Button as="div" 제거: 중첩 인터랙션/터치 씹힘 방지 */}
          <PickerWrapper
            mt={1}
            w="160px"
            bg="gray.800"
            border="var(--border-main)"
            borderRadius="8px"
          >
            <StyledDatePicker
              locale="ko"
              selected={birthday}
              onChange={(date) => {
                setBirthday(date as Date);
                closeAllPickers();
              }}
              dateFormat="출생연도 / 월 선택"
              showMonthYearPicker
              shouldCloseOnSelect
              popperPlacement="bottom"
              // ✅ WebView 안정화
              withPortal
              // ✅ open 제어로 overlay 잔상 방지
              open={openMonth}
              onInputClick={() => {
                setOpenDay(false);
                setOpenMonth(true);
              }}
              onClickOutside={closeAllPickers}
              onCalendarClose={closeAllPickers}
              customInput={<CustomButton value="연도 / 월 선택" />}
            />
          </PickerWrapper>

          <PickerWrapper
            mt={3}
            w="160px"
            bg="gray.800"
            border="var(--border-main)"
            borderRadius="8px"
          >
            <StyledDatePicker
              locale="ko"
              selected={birthday}
              onChange={(date) => {
                setBirthday(date as Date);
                closeAllPickers();
              }}
              dateFormat="날짜 선택"
              preventOpenOnFocus
              shouldCloseOnSelect
              popperPlacement="bottom"
              // ✅ WebView 안정화
              withPortal
              // ✅ open 제어로 overlay 잔상 방지
              open={openDay}
              onInputClick={() => {
                setOpenMonth(false);
                setOpenDay(true);
              }}
              onClickOutside={closeAllPickers}
              onCalendarClose={closeAllPickers}
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
          </PickerWrapper>
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

/**
 * ✅ 기존 CSS 100% 동일 유지
 */
const PickerWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--gray-500);
  }

  &:focus-within {
    background: var(--gray-500);
  }
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

/**
 * ✅ 훅 전체: null 케이스까지 타입 안전화
 */
export const useUserKakaoInfoQuery = (): {
  data: KakaoProfile["kakao_account"] | IUser | null;
  type: "kakao" | "user" | null;
} => {
  const { data: userInfo } = useUserInfoQuery();

  if (!userInfo) return { data: null, type: null };

  return {
    data: (userInfo as any)?.kakao_account ?? (userInfo as any),
    type: (userInfo as any)?.kakao_account ? "kakao" : "user",
  };
};
