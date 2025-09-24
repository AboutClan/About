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
    <Button variant="unstyled" onClick={handleCopy}>
      <CopyIcon />
    </Button>
  );
}

const LayoutLg = styled.div``;

function CopyIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16px"
    viewBox="0 -960 960 960"
    width="16px"
    fill="var(--gray-800)"
  >
    <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360ZM200-80q-33 0-56.5-23.5T120-160v-520q0-17 11.5-28.5T160-720q17 0 28.5 11.5T200-680v520h400q17 0 28.5 11.5T640-120q0 17-11.5 28.5T600-80H200Z" />
  </svg>
}
