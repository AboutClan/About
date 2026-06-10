import { ChangeEvent, useRef, useState } from "react";

import { Input } from "../../../components/atoms/Input";
import BottomNav from "../../../components/layouts/BottomNav";
import ProgressHeader from "../../../components/molecules/headers/ProgressHeader";
import { REGISTER_INFO } from "../../../constants/keys/localStorage";
import { useUserNicknamesQuery } from "../../../hooks/user/queries";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { IUserRegisterFormWriting } from "../../../types/models/userTypes/userInfoTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../../utils/storageUtils";

function Nickname() {
  const infoRef = useRef<IUserRegisterFormWriting>(getLocalStorageObj(REGISTER_INFO));
  const info = infoRef.current;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  // 저장된 nickname이 있으면 우선 사용, 없으면 NICE 인증에서 받은 name 사용
  const [value, setValue] = useState<string>(info?.nickname ?? info?.name ?? "");

  const { data } = useUserNicknamesQuery();

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
    if (value.length < 1 || value.length > 5) {
      setErrorMessage("글자수를 확인해주세요.");
      e.preventDefault();
      return;
    }
    if (data.includes(value)) {
      setErrorMessage("이미 등록된 닉네임입니다.");
      e.preventDefault();
      return;
    }

    setLocalStorageObj(REGISTER_INFO, { ...info, nickname: value });
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nickname = e.target.value;
    setValue(nickname);
  };

  return (
    <>
      <ProgressHeader title="회원가입" value={50} />
      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>사용할 닉네임을 작성해 주세요</span>
          <span>언제든 변경할 수 있어요!</span>
        </RegisterOverview>
        <div ref={containerRef}>
          <Input
            ref={inputRef}
            value={value}
            onChange={onChange}
            placeholder="다섯 글자 이내 작성"
            onFocus={scrollToInput}
          />
        </div>
      </RegisterLayout>
      <BottomNav onClick={onClickNext} url="/cafe-map/register/gender" />
    </>
  );
}

export default Nickname;
