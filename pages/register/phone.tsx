import { useRouter } from "next/router";
import { KakaoProfile } from "next-auth/providers/kakao";
import { useEffect, useRef, useState } from "react";

import { Input } from "../../components/atoms/Input";
import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import { useErrorToast, useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation, useUserRegisterMutation } from "../../hooks/user/mutations";
import { useUserKakaoInfoQuery } from "../../hooks/user/queries";
import { gaEvent } from "../../libs/gtag";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { IUserRegisterFormWriting } from "../../types/models/userTypes/userInfoTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

function Phone() {
  const toast = useToast();
  const router = useRouter();
  const errorToast = useErrorToast();
  const info: IUserRegisterFormWriting = getLocalStorageObj(REGISTER_INFO);

  const { data, type } = useUserKakaoInfoQuery();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState(info?.telephone || "");
  const [isModal, setIsModal] = useState(false);

  const { mutate: changeRole } = useUserInfoFieldMutation("role");

  const { mutate, isLoading } = useUserRegisterMutation({
    onSuccess() {
      const moving = localStorage.getItem("moving");
      if (moving) gaEvent("register_complete_by_cafe_map");
      else gaEvent("register_complete");
      changeRole({ role: "waiting" });

      setLocalStorageObj(REGISTER_INFO, null);
      toast("success", "신청 완료! 최종 가입 페이지로 이동합니다.");
      setIsModal(true);
      setTimeout(() => {
        router.push("/register/access");
      }, 1000);
    },
    onError: errorToast,
  });

  const formatKoreanPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace("+82", "0").replace(/\s+/g, "");
    const digits = cleaned.replace(/-/g, "");
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  };

  const scrollToInput = () => {
    if (!containerRef.current) return;
    const OFFSET = 108; // 👈 원하는 만큼 조절 (px)
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
    if (value === "" || value.length < 11) {
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
    console.log(info);

    mutate(info);
  };

  return (
    <>
      <ProgressHeader title="회원가입" value={100} />
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
      {!isModal && (
        <BottomNav isLoading={isLoading || isModal} onClick={onClickNext} text="가입 신청 완료" />
      )}
    </>
  );
}

export default Phone;
