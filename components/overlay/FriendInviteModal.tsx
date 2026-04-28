import { Box, Button } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";

import ScreenOverlay from "../atoms/ScreenOverlay";

function FriendInviteModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

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
            router.push(`/board`);
          }}
          position="relative"
          w="full"
          h="full"
          borderRadius="12px"
          overflow="hidden"
        >
          <Image
            src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%B4%88%EB%8C%80%EC%9D%B4%EB%B2%A4%ED%8A%B8.png"
            fill
            alt="friendInvite"
          />
        </Box>
        <Button
          pos="absolute"
          top="-17px"
          right="-17px"
          variant="unstyled"
          p={2}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
        >
          <XIcon />
        </Button>
      </Box>
    </>
  );
}

function XIcon() {
  return <svg width="26" height="26" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="black" />
    <path d="M7 7L17 17M17 7L7 17" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
}

export default FriendInviteModal;
