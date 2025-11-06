import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import styled from "styled-components";

import { useUserInfoQuery } from "../../../hooks/user/queries";
import { ModalLayout } from "../../../modals/Modals";
import { CommentProps } from "../../../types/models/commonTypes";
import { IUserSummary, UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import Avatar from "../../atoms/Avatar";
import UserBadge from "../../atoms/badges/UserBadge";
import Textarea from "../../atoms/Textarea";
import { ChatTalkIcon } from "../../Icons/chatIcons";
import { CrownIcon } from "../../Icons/icons";

export interface IProfileCommentCard {
  user: UserSimpleInfoProps | IUserSummary;
  memo?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  hasCommentButton?: boolean;
  comment?: CommentProps;
  changeComment?: (comment: string) => void;
  size?: "md" | "lg";
  isNoBorder?: boolean;
  crownType?: "main" | "sub";
}

export default function ProfileCommentCard({
  user,
  memo,
  leftComponent,
  rightComponent,
  changeComment,
  hasCommentButton,
  comment,
  isNoBorder,
  crownType,
}: IProfileCommentCard) {
  const [isCommentModal, setIsCommentModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [text, setText] = useState(comment?.comment || "");

  const { data: userInfo } = useUserInfoQuery();

  const changeText = () => {
    changeComment(text);
    setIsEdit(false);
    setIsCommentModal(false);
  };

  const closeModal = () => {
    setIsCommentModal(false);
    setIsEdit(false);
  };

  return (
    <>
      <Flex py={2.5} align="center" {...(!isNoBorder && { borderBottom: "var(--border)" })}>
        {leftComponent && <Box mr="16px">{leftComponent}</Box>}
        <Avatar user={user} size="md1" />
        <Flex direction="column" flex={0.95} justify="center" ml={3} my={1}>
          <Flex align="center" mb={memo || comment ? 1 : 0}>
            <Box lineHeight="20px" mr={1} fontWeight="semibold" fontSize="13px">
              {user?.name || "익명"}
            </Box>
            <UserBadge badgeIdx={user?.badge?.badgeIdx} />

            {crownType && (
              <Flex justify="center" align="center" ml={1}>
                <CrownIcon color={crownType === "main" ? "yellow" : "gray"} />
              </Flex>
            )}
            {false && (
              <Button ml={1} variant="unstyled" onClick={() => setIsCommentModal(true)}>
                <ChatTalkIcon isActive={!!comment} />
              </Button>
            )}
          </Flex>
          <Flex lineHeight="18px" alignItems="center" color="gray.500" fontSize="12px">
            <CommentText>{memo || text}</CommentText>
            {user.uid === userInfo?.uid && hasCommentButton && (
              <Button variant="unstyled" ml={1} onClick={() => setIsCommentModal(true)}>
                <EditIcon2 />
              </Button>
            )}
          </Flex>
        </Flex>
        <RightComponentContainer>{rightComponent}</RightComponentContainer>
      </Flex>
      {isCommentModal && (
        <ModalLayout
          footerOptions={{
            main: {
              text: isEdit ? (comment?.comment ? "변 경" : "입 력") : "확 인",
              func: isEdit ? changeText : closeModal,
            },
            ...(isEdit && { sub: { func: closeModal } }),
            isFull: false,
          }}
          setIsModal={setIsCommentModal}
          title="출석 메세지로 서로 알아봐요!"
        >
          {!isEdit ? (
            <Box
              border="var(--border)"
              textAlign="start"
              p={2}
              borderRadius="12px"
              w="full"
              h="full"
              color="gray.500"
            >
              {comment?.comment || "미작성"}
              {user.uid === userInfo?.uid && (
                <Button ml={2} variant="unstyled" onClick={() => setIsEdit(true)}>
                  <Box mb="2px">
                    <EditIcon />
                  </Box>
                </Button>
              )}
            </Box>
          ) : (
            <Textarea defaultValue={comment?.comment} onChange={(e) => setText(e.target.value)} />
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
  margin-left: auto;
`;

function EditIcon2() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="12px"
      viewBox="0 -960 960 960"
      width="12px"
      fill="var(--gray-600)"
    >
      <path d="M400-360q-17 0-28.5-11.5T360-400v-97q0-16 6-30.5t17-25.5l344-344q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L553-384q-11 11-25.5 17.5T497-360h-97Zm384-368 57-56-56-56-57 56 56 56ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h260q14 0 23 7t14 18q5 11 3.5 22T489-772L303-586q-11 11-17 25.5t-6 30.5v170q0 33 23.5 56.5T360-280h169q16 0 30.5-6t25.5-17l187-187q10-10 21-11.5t22 3.5q11 5 18 14t7 23v261q0 33-23.5 56.5T760-120H200Z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="14px"
      viewBox="0 -960 960 960"
      width="14px"
      fill="var(--color-mint)"
    >
      <path d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z" />
    </svg>
  );
}
