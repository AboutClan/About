import { useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { Input } from "../../components/atoms/Input";
import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import { useUserKakaoInfoQuery } from "../../hooks/user/queries";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { IUserRegisterFormWriting } from "../../types/models/userTypes/userInfoTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";
import { checkIsKorean } from "../../utils/validationUtils";

function Name() {
  const searchParams = useSearchParams();
  const isProfileEdit = !!searchParams.get("edit");

  const info: IUserRegisterFormWriting = getLocalStorageObj(REGISTER_INFO);

  const { data } = useUserKakaoInfoQuery();
  console.log(1, data);
  const inputRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState<string>(info?.name ?? "");

  useEffect(() => {
    if (!data || info?.name) return;
    setValue(data?.name || "");
  }, [data]);

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
      <ProgressHeader title={!isProfileEdit ? "회원가입" : "프로필 수정"} value={11} url="/login" />
      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>이름을 입력해 주세요</span>
          <span>실명으로 작성해 주세요!</span>
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
