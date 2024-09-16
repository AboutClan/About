import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { Input } from "../../components/atoms/Input";
import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { IUserRegisterFormWriting } from "../../types/models/userTypes/userInfoTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";
import { checkIsKorean } from "../../utils/validationUtils";

function Name() {
  const searchParams = useSearchParams();

  const { data: session } = useSession();

  const info: IUserRegisterFormWriting = getLocalStorageObj(REGISTER_INFO);

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 500);
    }
  }, []);

  const isProfileEdit = !!searchParams.get("edit");

  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState(info?.name || session?.user.name);

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
      <ProgressHeader title={!isProfileEdit ? "회원가입" : "프로필 수정"} value={20} />
      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>이름을 입력해 주세요</span>
          <span>실명으로 작성해주세요!</span>
        </RegisterOverview>
        <Input
          ref={inputRef}
          value={value}
          onChange={onChange}
          placeholder="이름을 입력해주세요."
          disabled={isProfileEdit}
        />
      </RegisterLayout>
      <BottomNav onClick={onClickNext} url="/register/gender" />
    </>
  );
}

export default Name;
