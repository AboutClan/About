import { Box, Button, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";
import { ModalLayout } from "../../../modals/Modals";
import { MessageSimpleProps } from "../../../types/models/commonTypes";

import { UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import Avatar from "../../atoms/Avatar";
import UserBadge from "../../atoms/badges/UserBadge";
import BasicAvatar from "../../atoms/BasicAvatar";
import Textarea from "../../atoms/Textarea";
import { ChatTalkIcon } from "../../Icons/chatIcons";

export interface IProfileCommentCard {
  user: UserSimpleInfoProps;
  memo?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;

  comment?: MessageSimpleProps;
  changeComment?: (comment: string) => void;
}

export default function ProfileCommentCard({
  user,
  memo,
  leftComponent,
  rightComponent,
  changeComment,
  comment,
}: IProfileCommentCard) {
  const { data: session } = useSession();
  const [isCommentModal, setIsCommentModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [text, setText] = useState(comment?.text || "");

  return (
    <>
      <Flex py={3}>
        {leftComponent && <Box mr="16px">{leftComponent}</Box>}
        {user ? (
          <Avatar image={user.profileImage} size="md" avatar={user.avatar} uid={user.uid} />
        ) : (
          <BasicAvatar />
        )}
        <Flex direction="column" justify="center" ml={3} my={1}>
          <Flex align="center" mb={memo ? 1 : 0}>
            <Box as="span" mr={1} fontWeight="semibold" fontSize="13px">
              {user?.name}
            </Box>
            <UserBadge score={user?.score || 0} uid={user?.uid} />
            <Button ml={1} variant="unstyled" onClick={() => setIsCommentModal(true)}>
              <ChatTalkIcon isActive={!!comment} />
            </Button>
          </Flex>
          <Flex lineHeight="18px" alignItems="center" color="gray.500" fontSize="12px">
            <CommentText>{memo}</CommentText>
          </Flex>
        </Flex>
        <RightComponentContainer>{rightComponent}</RightComponentContainer>
      </Flex>
      {isCommentModal && (
        <ModalLayout
          footerOptions={{
            main: {
              text: isEdit ? "변경" : "확인",
              func: isEdit ? () => changeComment(text) : null,
            },
            sub: {},
            isFull: false,
          }}
          setIsModal={setIsCommentModal}
          title={`${user.name}님의 한줄 코멘트`}
        >
          {!isEdit ? (
            <Box
              border="var(--border)"
              textAlign="start"
              p={2}
              borderRadius="12px"
              color="gray.500"
            >
              {comment?.text} 테스트 코멘트 작성을 해보겠습니다. 테스트입니다.
              {user.uid === session?.user.uid && (
                <Button ml={1} variant="unstyled" color="mint" onClick={() => setIsEdit(true)}>
                  <i className="fa-solid fa-pen-to-square fa-sm" />
                </Button>
              )}
            </Box>
          ) : (
            <Textarea defaultValue={comment?.text} />
          )}
        </ModalLayout>
      )}
    </>
  );
}

const CommentText = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  color: var(--gray-500);
  font-size: 12px;
  line-height: 18px;
`;

const RightComponentContainer = styled.div`
  margin-right: 4px;
  margin-left: auto;
`;
