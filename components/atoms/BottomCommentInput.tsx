import { Box } from "@chakra-ui/react";

import { SECRET_USER_SUMMARY } from "../../constants/serviceConstants/userConstants";
import { useKeypadHeight } from "../../hooks/custom/useKeypadHeight";
import { iPhoneNotchSize } from "../../utils/validationUtils";
import UserCommentInput from "../molecules/UserCommentInput";

interface BottomCommentInputProps {
  onSubmit: (value: string) => void;
  type?: "comment" | "message";
  replyName: string;
}

function BottomCommentInput({ onSubmit, type = "comment", replyName }: BottomCommentInputProps) {
  const keypadHeight = useKeypadHeight();

  return (
    <Box
      position="fixed"
      borderTop="var(--border)"
      bottom="0"
      flex={1}
      w="100%"
      backgroundColor="white"
      maxW="var(--max-width)"
      pb={`${keypadHeight === 0 ? iPhoneNotchSize() : 0}px`}
    >
      <Box py={2} borderBottom="var(--border)" px={5}>
        <UserCommentInput
          user={SECRET_USER_SUMMARY}
          onSubmit={onSubmit}
          type={type}
          replyName={replyName}
          
        />
      </Box>
    </Box>
  );
}

export default BottomCommentInput;
