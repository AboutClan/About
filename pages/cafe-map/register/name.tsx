import { ChangeEvent, useRef, useState } from "react";

import { Input } from "../../../components/atoms/Input";
import BottomNav from "../../../components/layouts/BottomNav";
import ProgressHeader from "../../../components/molecules/headers/ProgressHeader";
import { REGISTER_INFO } from "../../../constants/keys/localStorage";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { IUserRegisterFormWriting } from "../../../types/models/userTypes/userInfoTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../../utils/storageUtils";

function Name() {
  const infoRef = useRef<IUserRegisterFormWriting>(getLocalStorageObj(REGISTER_INFO));
  const info = infoRef.current;

  const [value, setValue] = useState<string>(info?.name ?? "");
  const [errorMessage, setErrorMessage] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToInput = () => {
    if (!containerRef.current) return;
    const elementTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: elementTop - 108, behavior: "smooth" });
  };

  const onClickNext = (e) => {
    const trimmed = value.trim();
    if (trimmed.length < 1) {
      setErrorMessage("이름을 입력해 주세요.");
      e.preventDefault();
      return;
    }
    setLocalStorageObj(REGISTER_INFO, { ...info, name: trimmed, birth: "" });
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setErrorMessage("");
  };

  return (
    <>
      <ProgressHeader title="회원가입" value={33} />
      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>이름을 입력해 주세요</span>
          <span>실명으로 입력해 주세요</span>
        </RegisterOverview>
        <div ref={containerRef}>
          <Input
            ref={inputRef}
            value={value}
            onChange={onChange}
            placeholder="이름 입력"
            onFocus={scrollToInput}
          />
        </div>
      </RegisterLayout>
      <BottomNav onClick={onClickNext} url="/cafe-map/register/nickname" />
    </>
  );
}

export default Name;
