import { KakaoProfile } from "next-auth/providers/kakao";
import { useEffect, useRef, useState } from "react";

import { Input } from "../../components/atoms/Input";
import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import { useUserKakaoInfoQuery } from "../../hooks/user/queries";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { IUserRegisterFormWriting } from "../../types/models/userTypes/userInfoTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

function Phone() {
  const info: IUserRegisterFormWriting = getLocalStorageObj(REGISTER_INFO);

  const { data, type } = useUserKakaoInfoQuery();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState(info?.telephone || "");

  const formatKoreanPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace("+82", "0").replace(/\s+/g, "");
    const digits = cleaned.replace(/-/g, "");
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  };

  const scrollToInput = () => {
    if (!containerRef.current) return;
    const OFFSET = 136; // 👈 원하는 만큼 조절 (px)
    const elementTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementTop - OFFSET,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (info?.telephone || !data) return;
    if (type === "kakao") {
      setValue(formatKoreanPhoneNumber((data as KakaoProfile["kakao_account"]).phone_number));
    }
  }, [data]);

  const phoneRegex = /^010-\d{4}-\d{4}$/;

  const onClickNext = (e) => {
    if (value === "") {
      setErrorMessage("핸드폰 번호를 입력해 주세요.");
      e.preventDefault();
      return;
    }
    if (!phoneRegex.test(value)) {
      setErrorMessage("핸드폰 번호를 확인해 주세요. 형식: 010-1234-5678");
      e.preventDefault();
      return;
    }

    setLocalStorageObj(REGISTER_INFO, { ...info, telephone: value });
  };

  return (
    <>
      <ProgressHeader title="회원가입" value={90} />
      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>핸드폰 번호를 입력해 주세요</span>
          <span>본인 확인 및 가입 승인을 위한 목적입니다.</span>
        </RegisterOverview>
        <div ref={containerRef}>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="010-1234-5678"
            ref={inputRef}
            onFocus={scrollToInput} // ✅ 추가
          />
        </div>
      </RegisterLayout>
      <BottomNav onClick={onClickNext} url="/register/fee" />
    </>
  );
}

export default Phone;
