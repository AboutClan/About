import { Button } from "@chakra-ui/react";
import { faCopy } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

import { useCompleteToast, useToast } from "../../../hooks/custom/CustomToast";

interface ICopyBtn {
  size?: string;
  text: string;
}

export function CopyBtn({ size, text }: ICopyBtn) {
  const completeToast = useCompleteToast();
  const toast = useToast();
  if (!size) size = "sm";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      completeToast("free", "복사 완료");
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
        leftIcon={<FontAwesomeIcon icon={faCopy} />}
        size="xs"
        colorScheme="twitter"
        onClick={handleCopy}
      >
        <span>복사하기</span>
      </Button>
    );

  return (
    <button onClick={handleCopy}>
      <FontAwesomeIcon icon={faCopy} color="var(--gray-1)" />
    </button>
  );
}

const LayoutLg = styled.div``;
