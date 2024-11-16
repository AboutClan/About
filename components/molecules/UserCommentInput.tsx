import { Button, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { ReplyProps } from "../../pageTemplates/square/SecretSquare/SecretSquareComments";
import { DispatchType } from "../../types/hooks/reactTypes";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import Avatar from "../atoms/Avatar";

interface UserCommentInputProps {
  type?: "comment" | "message";
  onSubmit: (value: string) => void;
  user: IUserSummary;
  initialFocus?: boolean;
  replyName: string;
  setReplyProps: DispatchType<ReplyProps>;
}

function UserCommentInput({
  user,
  onSubmit,
  initialFocus,
  type = "comment",
  replyName,
  setReplyProps,
}: UserCommentInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState(replyName ? "@" + replyName + " " : "");

  useEffect(() => {
    if (replyName) {
      setText("@" + replyName + " ");
      textareaRef.current.focus();
    }
  }, [replyName]);

  useEffect(() => {
    if (!user) return;
    if (initialFocus) textareaRef.current.focus();
    if (replyName && text && !text.startsWith("@" + replyName)) {
      setReplyProps(null);
      setText("");
    }

    if (!text) {
      textareaRef.current.style.height = `18px`;
    } else if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text, user]);

  const onClick = () => {
    onSubmit(text);
    setText("");
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
  };

  return (
    <Flex align="center" flex={1}>
      {user && (
        <>
          <Flex
            justify="center"
            align="center"
            p="3px"
            borderRadius="50%"
            border="1px solid var(--color-mint)"
            w="46px"
            h="46px"
          >
            <Avatar
              isLink={false}
              size="mds"
              userId={user._id}
              uid={user.uid}
              avatar={user.avatar}
              image={user.profileImage}
            />
          </Flex>

          <Flex flex={1}>
            <MyTextArea
              placeholder={type === "comment" ? "댓글을 입력하세요..." : "메세지 입력"}
              ref={textareaRef}
              value={text}
              onChange={handleChange}
              replyName={replyName}
            />
          </Flex>
          {text && (
            <Button
              variant="unstyled"
              borderRadius="50%"
              w={9}
              h={9}
              bg="gray.800"
              color="white"
              onClick={onClick}
            >
              <i className="fa-regular fa-arrow-right fa-lg" />
            </Button>
          )}
        </>
      )}
    </Flex>
  );
}

const MyTextArea = styled.textarea<{ replyName: string }>`
  margin-left: 8px;
  flex: 1;
  background-color: inherit;
  height: 18px;
  padding-right: 10px;
  margin-right: 4px;
  overflow-y: auto;
  font-weight: light;
  font-size: 12px;
  color: var(--gray-800); /* 기본 텍스트는 검정색 */
  line-height: 18px;
  resize: none;
  outline: none;

  &::before {
    content: "${(props) => props.replyName} ";
    color: var(--color-mint); /* replyName 부분 민트색 */
  }
`;

export default UserCommentInput;
