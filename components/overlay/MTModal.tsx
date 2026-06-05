import { Box, Button } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";

import { navigateExternalLink } from "../../utils/navigateUtils";
import ScreenOverlay from "../atoms/ScreenOverlay";

function MTModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  console.log(555);
  return (
    <>
      <ScreenOverlay zIndex={1000} onClick={onClose} />
      <Box
        pos="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="280px"
        h="350px"
        zIndex={2000}
      >
        <Box
          onClick={() => {
            navigateExternalLink(`http://about20s.club/Summer-MT`);
          }}
          position="relative"
          w="full"
          h="full"
          borderRadius="12px"
          overflow="hidden"
        >
          <Image
            src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%97%AC%EB%A6%84MT+%EC%B9%B4%EB%93%9C%EB%89%B4%EC%8A%A4.png"
            fill
            alt="friendInvite"
          />
        </Box>
        <Button
          pos="absolute"
          top="0px"
          right="0px"
          variant="unstyled"
          p={2}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="white"
          >
            <path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z" />
          </svg>
        </Button>
      </Box>
    </>
  );
}

function XIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="black" />
      <path d="M7 7L17 17M17 7L7 17" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default MTModal;
