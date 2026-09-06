import { ChangeEvent, useEffect, useRef, useState } from "react";

import { Input } from "@/components/atoms/Input";
import BottomNav from "@/components/layouts/BottomNav";
import ProgressHeader from "@/components/molecules/headers/ProgressHeader";
import { REGISTER_INFO } from "@/constants/keys/localStorage";
import { useUserKakaoInfoQuery } from "@/hooks/user/queries";
import RegisterLayout from "@/pageTemplates/register/RegisterLayout";
import RegisterOverview from "@/pageTemplates/register/RegisterOverview";
import { IUserRegisterFormWriting } from "@/types/models/userTypes/userInfoTypes";
import { getLocalStorageObj, setLocalStorageObj } from "@/utils/storageUtils";
import { checkIsKorean } from "@/utils/validationUtils";

function Name() {
  const info: IUserRegisterFormWriting = getLocalStorageObj(REGISTER_INFO);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { data } = useUserKakaoInfoQuery();

  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState<string>(info?.name ?? "");

  useEffect(() => {
    if (!data || info?.name) return;
    setValue(data?.name || "");
  }, [data]);

  const scrollToInput = () => {
    if (!containerRef.current) return;
    const OFFSET = 108; // 👈 원하는 만큼 조절 (px)
    const elementTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementTop - OFFSET,
      behavior: "smooth",
    });
  };

  const onClickNext = (e) => {
    if (value.length < 2 || value.length > 4) {
      setErrorMessage("글자수를 확인해주세요.");
      e.preventDefault();
      return;
    }
    if (!checkIsKorean(value)) {
      setErrorMessage("한글로만 입력해 주세요.");
      e.preventDefault();
      return;
    }
    setLocalStorageObj(REGISTER_INFO, { ...info, name: value });
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue(name);
  };

  return (
    <>
      <ProgressHeader title="회원가입" value={11} url="/login" />
      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>이름을 입력해 주세요</span>
          <span>실명으로 작성해 주세요!</span>
        </RegisterOverview>
        <div ref={containerRef}>
          <Input
            ref={inputRef}
            value={value}
            onChange={onChange}
            placeholder="이름을 입력해주세요."
            onFocus={scrollToInput}
          />
        </div>
      </RegisterLayout>
      <BottomNav onClick={onClickNext} url="/register/gender" />
    </>
  );
}

export default Name;
