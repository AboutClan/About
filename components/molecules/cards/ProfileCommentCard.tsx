import { Box, Flex } from "@chakra-ui/react";
import styled from "styled-components";

import { UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import Avatar from "../../atoms/Avatar";
import UserBadge from "../../atoms/badges/UserBadge";
import BasicAvatar from "../../atoms/BasicAvatar";

export interface IProfileCommentCard {
  user: UserSimpleInfoProps;
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
    <Flex py={3}>
      {leftComponent && <Box mr="16px">{leftComponent}</Box>}
      {user ? (
        <Avatar image={user.profileImage} size="md" avatar={user.avatar} uid={user.uid} />
      ) : (
        <BasicAvatar />
      )}
      <Box ml={3} my={1}>
        <Flex align="center" mb={1}>
          <Box as="span" mr={1} fontWeight="semibold" fontSize="13px">
            {user?.name}
          </Box>
          <UserBadge score={user?.score || 0} uid={user?.uid} />
        </Flex>
        <Flex alignItems="center" flex={1} color="gray.500" fontSize="12px">
          <CommentText>{comment}</CommentText>
          {setMemo && (
            <Button onClick={setMemo}>
              <i className="fa-regular fa-pen-to-square fa-sm" />
            </Button>
          )}
        </Flex>
      </Box>
      <RightComponentContainer>{rightComponent}</RightComponentContainer>
    </Flex>
  );
}

const Button = styled.button`
  display: inline-block;
  margin-left: 4px;
  padding: 0 4px;
  color: var(--gray-600);
`;


const CommentText = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  color: var(--gray-500);
  font-size: 12px;
  line-height: 16px;
`;

const RightComponentContainer = styled.div`
  margin-right: 4px;
  margin-left: auto;
`;
