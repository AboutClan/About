import { Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MouseEvent, useRef, useState } from "react";
import styled from "styled-components";

import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { MESSAGE_DATA } from "../../constants/contentsText/ProfileData";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import { useErrorToast, useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation, useUserRegisterMutation } from "../../hooks/user/mutations";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { IUserRegisterFormWriting } from "../../types/models/userTypes/userInfoTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

const DEFAULT_LOCATION_DETAIL = {
  name: "서울",
  address: "서울특별시",
  latitude: 37.5665,
  longitude: 126.978,
};

function Comment2() {
  const router = useRouter();
  const toast = useToast();
  const errorToast = useErrorToast();
  const info = getLocalStorageObj(REGISTER_INFO) as IUserRegisterFormWriting;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState("");
  const [index, setIndex] = useState<number>(1);

  const { mutate: changeRole } = useUserInfoFieldMutation("role");

  const { mutate, isLoading } = useUserRegisterMutation({
    onSuccess() {
      changeRole({ role: "waiting" });
      setLocalStorageObj(REGISTER_INFO, null);
      toast("success", "가입 신청 완료! 카공지도로 이동합니다.");
      setTimeout(() => {
        router.push("/cafe-map");
      }, 1000);
    },
    onError: errorToast,
  });

  const scrollToInput = () => {
    if (!containerRef.current) return;
    const elementTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: elementTop - 108, behavior: "smooth" });
  };

  const onClickNext = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (index === 0 && value === "") {
      e.preventDefault();
      setErrorMessage("문장을 선택해 주세요.");
      return;
    }

    const comment = index === 0 ? value : MESSAGE_DATA[index - 1];

    const registerData: IUserRegisterFormWriting = {
      name: info?.name ?? "",
      gender: info?.gender ?? "남성",
      birth: info?.birth ?? "",
      telephone: info?.telephone ?? "",
      comment,
      location: "서울특별시" as any,
      locationDetail: DEFAULT_LOCATION_DETAIL,
      mbti: "",
      interests: { first: "" },
      majors: [{ department: "", detail: "" }],
      introduceText: "",
      route: "카공지도",
    };

    setLocalStorageObj(REGISTER_INFO, null);
    mutate(registerData);
  };

  return (
    <>
      <ProgressHeader title="회원가입" value={100} />
      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>한 줄 코멘트를 입력해 주세요</span>
          <span>프로필에 노출되는 내용으로, 한 마디를 남겨주세요!</span>
        </RegisterOverview>
        <div ref={containerRef} onClick={() => setIndex(0)}>
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
            _placeholder={{ color: "var(--gray-500)" }}
            onFocus={scrollToInput}
          />
        </div>
        <Container>
          {MESSAGE_DATA.map((item, idx) => (
            <Item key={idx} onClick={() => setIndex(idx + 1)} $isSelected={idx + 1 === index}>
              {item}
            </Item>
          ))}
        </Container>
      </RegisterLayout>
      <BottomNav isLoading={isLoading} onClick={onClickNext} text="가입 신청 완료" />
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

export default Comment2;
