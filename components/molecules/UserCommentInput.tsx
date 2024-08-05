import { Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import Avatar from "../atoms/Avatar";

interface UserCommentInputProps {
  user: IUserSummary;
  onSubmit: (value: string) => void;
  type?: "comment" | "message";
  initialFocus?: boolean;
}

function UserCommentInput({
  user,
  onSubmit,
  initialFocus,
  type = "comment",
}: UserCommentInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [text, setText] = useState("");

  useEffect(() => {
    if (!user) return;
    if (initialFocus) textareaRef.current.focus();
    if (!text) {
      textareaRef.current.style.height = `24px`;
    } else if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text, user]);

  const onClick = () => {
    onSubmit(text);
    setText("");
  };

  return (
    <Flex align="center" flex={1}>
      {user && (
        <>
          <Avatar
            isLink={false}
            size="sm"
            uid={user.uid}
            avatar={user.avatar}
            image={user.profileImage}
          />
          <Flex flex={1}>
            <MyTextArea
              placeholder={type === "comment" ? "댓글 달기..." : "메세지 입력"}
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Flex>
          <SubmitBtn focus={text !== ""} onClick={onClick}>
            {type === "comment" ? "등록" : "전송"}
          </SubmitBtn>
        </>
      )}
    </Flex>
  );
}

const MyTextArea = styled.textarea`
  margin-left: var(--gap-3);
  flex: 1;
  background-color: inherit;
  height: 28px;
  max-height: 40px;
  padding-right: 20px;
  overflow-y: auto;
  resize: none;
  &::-webkit-scrollbar {
    display: none;
  }
  :focus {
    outline: none;
  }
`;

const SubmitBtn = styled.button<{ focus: boolean }>`
  color: ${(props) => (props.focus ? "var(--color-mint)" : "var(--gray-500)")};
`;

export default UserCommentInput;
