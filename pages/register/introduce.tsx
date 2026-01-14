import { Box, Flex } from "@chakra-ui/react";
import { MouseEvent, useRef, useState } from "react";

import Textarea from "../../components/atoms/Textarea";
import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

function Comment() {
  const info = getLocalStorageObj(REGISTER_INFO);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollToInput = () => {
    if (!containerRef.current) return;
    const OFFSET = 164; // 👈 원하는 만큼 조절 (px)
    const elementTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementTop - OFFSET,
      behavior: "smooth",
    });
  };

  const [errorMessage, setErrorMessage] = useState("");

  const [text, setText] = useState(info?.introduceText || "");

  const onClickNext = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (text.length < 40) {
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
  };

  return (
    <>
      <ProgressHeader title="회원가입" value={80} />

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
              color={text.length >= 90 ? "red" : text.length < 40 ? "gray.500" : "gray.800"}
              mr={1}
            >
              {text.length}
            </Box>{" "}
            / {text.length >= 90 ? "최대 90자" : "최소 40자"}
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

      <BottomNav onClick={onClickNext} url="/register/phone" />
    </>
  );
}

export default Comment;
