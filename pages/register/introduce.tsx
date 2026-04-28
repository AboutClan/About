import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MouseEvent, useRef, useState } from "react";

import Textarea from "../../components/atoms/Textarea";
import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import { useErrorToast, useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation, useUserRegisterMutation } from "../../hooks/user/mutations";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import { gaEvent } from "../../libs/gtag";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { IUserRegisterFormWriting } from "../../types/models/userTypes/userInfoTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";
function Comment() {
  const toast = useToast();
  const router = useRouter();
  const errorToast = useErrorToast();
  const info = getLocalStorageObj(REGISTER_INFO) as IUserRegisterFormWriting;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { mutate: changeRole } = useUserInfoFieldMutation("role");
  const [isModal, setIsModal] = useState(false);

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

  const scrollToInput = () => {
    if (!containerRef.current) return;
    const OFFSET = 108; // 👈 원하는 만큼 조절 (px)
    const elementTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementTop - OFFSET,
      behavior: "smooth",
    });
  };

  const [errorMessage, setErrorMessage] = useState("");

  const [text, setText] = useState(info?.introduceText || "");

  const { mutate: request } = useUserRequestMutation();

  const onClickNext = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (text.length < 30) {
      setErrorMessage("조금만 더 적어주세요!");
      e.preventDefault();
      return;
    }
    if (text.length >= 90) {
      setErrorMessage("네줄 이하로 작성해주세요!");
      e.preventDefault();
      return;
    }
    setLocalStorageObj(REGISTER_INFO, { ...info, introduceText: text });

    const { route: content, ...registerData } = info;

    request({
      category: "경로",
      title: "가입 경로",
      content,
    });

    mutate({ ...registerData, introduceText: text });
  };

  return (
    <>
      <ProgressHeader title="회원가입" value={100} />

      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>자기소개를 입력해 주세요</span>
          <span>프로필에 공개되는 내용으로, 다른 멤버도 열람할 수 있어요!</span>
        </RegisterOverview>
        <Box ref={containerRef}>
          <Textarea
            h="96px"
            placeholder="나는 어떤 사람인가요? 사람들과 어울릴 때의 성격이나 대화 스타일을 적어주세요!"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={scrollToInput}
          />
          <Flex ml="auto" mt={1} w="max-content" fontSize="12px" color="gray.500">
            <Box
              color={text.length >= 90 ? "red" : text.length < 30 ? "gray.500" : "gray.800"}
              mr={1}
            >
              {text.length}
            </Box>{" "}
            / {text.length >= 90 ? "최대 90자" : "최소 30자"}
          </Flex>
          <Box
            fontSize="13px"
            color="gray.700"
            mt={5}
            bg="gray.100"
            w="full"
            px={4}
            py={3}
            borderRadius="12px"
          >
            ex. 같이 있으면 편하다는 말 많이 듣고, 처음 본 사람이랑도 금방 어울리는 편입니다🙂
            리액션도 많이 하고, 어색하면 먼저 나서기도 해요!
          </Box>
        </Box>
      </RegisterLayout>

      {!isModal && (
        <BottomNav isLoading={isLoading || isModal} onClick={onClickNext} text="가입 신청 완료" />
      )}
    </>
  );
}

export default Comment;
