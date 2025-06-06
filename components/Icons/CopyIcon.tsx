import { Button } from "@chakra-ui/react";
import styled from "styled-components";

import { useToast } from "../../hooks/custom/CustomToast";

interface ICopyBtn {
  size?: string;
  text: string;
}

export function CopyBtn({ size, text }: ICopyBtn) {
  const toast = useToast();
  if (!size) size = "sm";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast("success", "복사 완료");
    } catch {
      toast("error", "복사에 실패했습니다. 관리자에게 문의해주세요.");
    }
  };

  if (size === "lg")
    return (
      <LayoutLg onClick={handleCopy}>
        <Button width="100%">본문 내용 복사하기</Button>
      </LayoutLg>
    );

  if (size === "md")
    return (
      <Button
        leftIcon={<i className="fa-solid fa-copy" />}
        size="xs"
        colorScheme="twitter"
        onClick={handleCopy}
      >
        <span>복사하기</span>
      </Button>
    );

  return (
    <button onClick={handleCopy}>
      <i className="fa-solid fa-copy" style={{ color: "var(--gray-800)" }} />
    </button>
  );
}

const LayoutLg = styled.div``;
