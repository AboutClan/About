import { Box, Flex } from "@chakra-ui/react";
import styled from "styled-components";

import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import Avatar from "../../atoms/Avatar";
import UserBadge from "../../atoms/badges/UserBadge";
import BasicAvatar from "../../atoms/BasicAvatar";

export interface IProfileCommentCard {
  user: IUserSummary;
  comment?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  setMemo?: () => void;
}

export default function ProfileCommentCard({
  user,
  comment,
  leftComponent,
  rightComponent,
  setMemo,
}: IProfileCommentCard) {
  return (
    <CardContainer>
      {leftComponent && <Box mr="16px">{leftComponent}</Box>}
      {user ? (
        <Avatar image={user.profileImage} size="md" avatar={user.avatar} uid={user.uid} />
      ) : (
        <BasicAvatar />
      )}
      <UserInfoContainer>
        <UserNameBadgeContainer>
          <span>{user?.name || "비공개"}</span>
          <UserBadge score={user?.score || 0} uid={user?.uid} />
        </UserNameBadgeContainer>
        <Flex alignItems="center" flex={1}>
          <CommentText>{comment !== null ? comment : user.comment}</CommentText>
          {setMemo && (
            <Button onClick={setMemo}>
              <i className="fa-regular fa-pen-to-square fa-sm" />
            </Button>
          )}
        </Flex>
      </UserInfoContainer>
      <RightComponentContainer>{rightComponent}</RightComponentContainer>
    </CardContainer>
  );
}

const Button = styled.button`
  display: inline-block;
  margin-left: 4px;
  padding: 0 4px;
  color: var(--gray-600);
`;

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: var(--border-main);
  line-height: 24px;
  height: 72px;
`;

const UserInfoContainer = styled.div`
  margin-left: 12px;
  flex: 0.9;
`;

const UserNameBadgeContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px; /* text-sm */
  font-weight: 600; /* font-semibold */
  > span:first-child {
    margin-right: 6px;
  }
`;

const CommentText = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  color: var(--gray-600);
  font-size: 13px;
`;

const RightComponentContainer = styled.div`
  margin-right: 4px;
  margin-left: auto;
`;
