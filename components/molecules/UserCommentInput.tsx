import { Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";

import Avatar from "../atoms/Avatar";

interface UserCommentInputProps {
  user: IUserSummary;
  onSubmit: () => (value: string) => void;
}

function UserCommentInput({ user, onSubmit }: UserCommentInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [text, setText] = useState("");

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const onClick = () => {
    onSubmit()(text);
    setText("");
  };

  return (
    <Flex minH="60px" align="center" flex={1} mt="12px">
      <Avatar size="sm" uid={user.uid} avatar={user.avatar} image={user.profileImage} />
      <Flex h="22px" flex={1}>
        <MyTextArea
          placeholder="댓글 달기..."
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Flex>
      <SubmitBtn focus={text !== ""} onClick={onClick}>
        등록
      </SubmitBtn>
    </Flex>
  );
}

const MyTextArea = styled.textarea`
  margin-left: var(--gap-3);
  flex: 1;
  background-color: inherit;
  height: 21px;
  :focus {
    outline: none;
  }
  ::placeholder {
    font-size: 12px;
  }
`;

const SubmitBtn = styled.button<{ focus: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.focus ? "var(--color-mint)" : "var(--gray-500)")};
`;

export default UserCommentInput;
