import { Input } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { MouseEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { MESSAGE_DATA } from "../../constants/contentsText/ProfileData";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

function Comment() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const info = getLocalStorageObj(REGISTER_INFO);

  const isProfileEdit = !!searchParams.get("edit");
  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState(info?.comment || "");

  const [index, setIndex] = useState<number>();

  useEffect(() => {
    const comment = info?.comment;

    const findIdx = MESSAGE_DATA.findIndex((message) => message === comment);

    if (findIdx === -1) {
      setIndex(0);
      setTimeout(() => {
        inputRef.current?.focus(); // 포커싱
      }, 500);
    } else {
      setIndex(findIdx + 1);
    }
  }, [info]);

  const onClickNext = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if ((index === null || index === 0) && value === "") {
      e.preventDefault();
      setErrorMessage("문장을 선택해 주세요.");
      return;
    }

    let tempComment = "";
    if (index === 0 || index === null) tempComment = value;
    else tempComment = MESSAGE_DATA[index];

    setLocalStorageObj(REGISTER_INFO, { ...info, comment: tempComment });

    if (isProfileEdit) {
      router.push("/register/instagram");
    } else router.push(`/register/phone`);
  };

  const inputRef = useRef(null);

  // useEffect(() => {
  //   if (!index && value !== "") {
  //     setTimeout(() => {
  //       inputRef.current?.focus();
  //     }, 500);
  //   }
  // }, [index, value]);

  return (
    <>
      <ProgressHeader title={!isProfileEdit ? "회원가입" : "프로필 수정"} value={77} />

      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>한 줄 코멘트를 입력해 주세요</span>
          <span>프로필에 노출되는 내용으로, 한 마디를 남겨주세요!</span>
        </RegisterOverview>
        <div onClick={() => setIndex(0)}>
          <Input
            bgColor="white"
            placeholder="직접 입력"
            ref={inputRef}
            onChange={(e) => setValue(e.target?.value)}
            value={value}
            mb={3}
            h="48px"
            textAlign="center"
            fontSize="14px"
            focusBorderColor="#00c2b3"
            border={index === 0 ? "var(--border-mint)" : "var(--border-main)"}
            boxShadow="none !important"
            _placeholder={{
              color: "var(--gray-500)",
            }}
          />
        </div>
        <Container>
          {MESSAGE_DATA?.map((item, idx) => (
            <Item key={idx} onClick={() => setIndex(idx + 1)} $isSelected={idx + 1 === index}>
              {item}
            </Item>
          ))}
        </Container>
      </RegisterLayout>

      <BottomNav onClick={onClickNext} url={!isProfileEdit && "/register/phone"} />
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div<{ $isSelected: boolean }>`
  background-color: white;
  width: 100%;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  margin-bottom: var(--gap-3);
  color: ${(props) => (props.$isSelected ? "var(--gray-800)" : "var(--gray-500)")};
  border: ${(props) => (props.$isSelected ? "var(--border-mint)" : "var(--border-main)")};
`;

export default Comment;
