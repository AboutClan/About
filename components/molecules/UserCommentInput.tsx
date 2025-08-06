import { Button, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { ReplyProps } from "../../pageTemplates/community/SecretSquareComments";
import { DispatchType } from "../../types/hooks/reactTypes";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import Avatar from "../atoms/Avatar";

interface UserCommentInputProps {
  type?: "comment" | "message" | "review";
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
  }, [text, user, initialFocus]);

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
            alignSelf="flex-start"
            justify="center"
            align="center"
            p="3px"
            borderRadius="50%"
            border="1px solid var(--color-mint)"
            w="44px"
            h="44px"
          >
            <Avatar isLink={false} size="sm1" user={user} />
          </Flex>

          <Flex flex={1}>
            <MyTextArea
              placeholder={
                type === "comment"
                  ? "댓글을 입력하세요..."
                  : type === "review"
                  ? "모임 리뷰를 작성해 주세요."
                  : "메세지 입력"
              }
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
              bg="gray.900"
              color="white"
              onClick={onClick}
              display="flex"
              justifyItems="center"
              alignItems="center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2.6205 7.27988H11.0421L7.7715 4.00928C7.4901 3.72788 7.4901 3.27188 7.7715 2.99108C8.0529 2.70968 8.5083 2.70968 8.7897 2.99108L13.2897 7.49108C13.2915 7.49228 13.2921 7.49468 13.2939 7.49648C13.3581 7.56188 13.4097 7.63928 13.4451 7.72448C13.5183 7.90088 13.5183 8.09888 13.4451 8.27528C13.4097 8.36108 13.3581 8.43788 13.2939 8.50328C13.2921 8.50508 13.2915 8.50748 13.2897 8.50928L8.7897 13.0093C8.6493 13.1497 8.4651 13.2199 8.2809 13.2199C8.0961 13.2199 7.9119 13.1497 7.7715 13.0093C7.4901 12.7279 7.4901 12.2719 7.7715 11.9911L11.0421 8.71988H2.6205C2.2227 8.71988 1.9005 8.39768 1.9005 7.99988C1.9005 7.60268 2.2227 7.27988 2.6205 7.27988Z"
                  fill="white"
                />
              </svg>
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
