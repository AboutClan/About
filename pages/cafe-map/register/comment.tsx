import { Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { MouseEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import BottomNav from "../../../components/layouts/BottomNav";
import ProgressHeader from "../../../components/molecules/headers/ProgressHeader";
import { MESSAGE_DATA } from "../../../constants/contentsText/ProfileData";
import { REGISTER_INFO } from "../../../constants/keys/localStorage";
import { useErrorToast, useToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation, useUserRegisterMutation } from "../../../hooks/user/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { gaEvent } from "../../../libs/gtag";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { IUserRegisterFormWriting } from "../../../types/models/userTypes/userInfoTypes";
import { setAuthIntent } from "../../../utils/authIntentUtils";
import { getLocalStorageObj, setLocalStorageObj } from "../../../utils/storageUtils";

function Comment() {
  const router = useRouter();
  const toast = useToast();
  const errorToast = useErrorToast();
  const { data: session } = useSession();
  const info = getLocalStorageObj(REGISTER_INFO);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState("");
  const [index, setIndex] = useState<number>();
  const [isModal, setIsModal] = useState(false);

  const { mutate: changeRole } = useUserInfoFieldMutation("role");
  const { data: userInfo } = useUserInfoQuery();

  useEffect(() => {
    const comment = info?.comment;
    let timeoutId: ReturnType<typeof setTimeout>;
    const findIdx = MESSAGE_DATA.findIndex((message) => message === comment);
    if (findIdx === -1) {
      setIndex(0);
      setValue(comment ?? "");
      timeoutId = setTimeout(() => {
        scrollToInput();
        inputRef.current?.focus();
      }, 500);
    } else {
      setIndex(findIdx + 1);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const scrollToInput = () => {
    if (!containerRef.current) return;
    const OFFSET = 108;
    const elementTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: elementTop - OFFSET, behavior: "smooth" });
  };

  const { mutate, isLoading } = useUserRegisterMutation({
    onSuccess() {
      const moving = localStorage.getItem("moving");
      if (moving) gaEvent("register_complete_by_cafe_map");
      else gaEvent("register_complete");
      if (userInfo?.role !== "member") changeRole({ role: "waiting" });

      setLocalStorageObj(REGISTER_INFO, null);
      toast("success", "신청 완료! 최종 가입 페이지로 이동합니다.");
      setIsModal(true);
      setTimeout(() => {
        router.push("/register/access");
      }, 1000);
    },
    onError: errorToast,
  });

  useEffect(() => {
    if (session?.user.role === "guest" || session?.user.uid === "1234567890") {
      toast("error", "안전한 계정 확인을 위해 다시 한번 로그인 할게요!");
      setTimeout(async () => {
        setAuthIntent();
        await signOut({ redirect: false });
        await signIn("kakao", { callbackUrl: "/cafe-map/register/comment" });
      }, 1000);
    }
  }, [session]);

  const onClickNext = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if ((index === null || index === 0) && value === "") {
      e.preventDefault();
      setErrorMessage("문장을 선택해 주세요.");
      return;
    }

    let tempComment = "";
    if (index === 0 || index === null) tempComment = value;
    else tempComment = MESSAGE_DATA[index - 1];

    const { name, gender, telephone, birth, location } = info;
    setLocalStorageObj(REGISTER_INFO, { name, gender, telephone, birth, location, comment: tempComment });
    mutate({ name, gender, telephone, birth, location, comment: tempComment } as IUserRegisterFormWriting);
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
          {MESSAGE_DATA?.map((item, idx) => (
            <Item key={idx} onClick={() => setIndex(idx + 1)} $isSelected={idx + 1 === index}>
              {item}
            </Item>
          ))}
        </Container>
      </RegisterLayout>

      {!isModal && (
        <BottomNav isLoading={isLoading || isModal} onClick={onClickNext} text="가입 신청 완료" />
      )}
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
