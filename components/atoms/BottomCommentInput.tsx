import { Box } from "@chakra-ui/react";

import { SECRET_USER_SUMMARY } from "../../constants/serviceConstants/userConstants";
import { useKeypadHeight } from "../../hooks/custom/useKeypadHeight";
import { ReplyProps } from "../../pageTemplates/community/SecretSquareComments";
import { DispatchType } from "../../types/hooks/reactTypes";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import UserCommentInput from "../molecules/UserCommentInput";

interface BottomCommentInputProps {
  isFixed?: boolean;
  onSubmit: (value: string) => void;
  type?: "comment" | "message" | "review";
  replyName: string;
  user: IUserSummary;
  setReplyProps: DispatchType<ReplyProps>;
}

function BottomCommentInput({
  isFixed = true,
  onSubmit,
  type = "comment",
  replyName,
  user,
  setReplyProps,
}: BottomCommentInputProps) {
  const keypadHeight = useKeypadHeight();

  return (
    <Box
      position={isFixed ? "fixed" : "static"}
      borderTop="var(--border)"
      borderBottom={isFixed ? null : "var(--border)"}
      mt={isFixed ? null : 5}
      bottom="0"
      flex={1}
      w="100%"
      backgroundColor="white"
      maxW="var(--max-width)"
      pb={keypadHeight === 0 ? "env(safe-area-inset-bottom, 0px)" : "0px"}
    >
      <Box py={2} borderBottom="var(--border)" px={5}>
        <UserCommentInput
          user={user || SECRET_USER_SUMMARY}
          onSubmit={onSubmit}
          type={type}
          replyName={replyName}
          setReplyProps={setReplyProps}
        />
      </Box>
    </Box>
  );
}

export default BottomCommentInput;
