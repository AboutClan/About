import { useEffect, useRef, useState } from "react";

import Input from "../../components/atoms/Input";
import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

function Phone() {
  const info = getLocalStorageObj(REGISTER_INFO);

  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState(info?.telephone || "");

  const onClickNext = (e) => {
    if (value === "") {
      setErrorMessage("핸드폰 번호를 입력해 주세요.");
      e.preventDefault();
      return;
    }
    if (value.length < 11) {
      setErrorMessage("핸드폰 번호를 확인해 주세요.");
      e.preventDefault();
      return;
    }

    setLocalStorageObj(REGISTER_INFO, { ...info, telephone: value });
  };

  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 500);
  }, []);

  return (
    <>
      <ProgressHeader title="회원가입" value={90} />

      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>핸드폰 번호를 작성해 주세요</span>
          <span>해당 번호로 연락을 드리니 정확하게 작성해 주세요.</span>
        </RegisterOverview>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="전화번호를 입력해 주세요."
          inputRef={inputRef}
        />
      </RegisterLayout>
      <BottomNav onClick={onClickNext} url="/register/fee" />
    </>
  );
}

export default Phone;
