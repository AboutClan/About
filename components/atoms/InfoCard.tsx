import { Box, Flex } from "@chakra-ui/react";
import styled from "styled-components";

import Avatar from "./Avatar";

export interface IInfoCard {
  name: string;
  image: string;
  text: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  badge?: React.ReactNode;
}

export default function InfoCard({
  image,
  text,
  name,
  leftComponent,
  rightComponent,
  badge,
}: IInfoCard) {

  return (
    <CardContainer>
      {leftComponent && <Box mr="16px">{leftComponent}</Box>}
      <Avatar image={image} size="md" />
      <UserInfoContainer>
        <UserNameBadgeContainer>
          <span>{name}</span>
          {badge}
        </UserNameBadgeContainer>
        <Flex alignItems="center">
          <CommentText>{text}</CommentText>
        </Flex>
      </UserInfoContainer>
      <RightComponentContainer>{rightComponent}</RightComponentContainer>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: var(--border-main);
  line-height: 24px;
  height: 72px;
`;

const UserInfoContainer = styled.div`
  margin-left: 12px; /* ml-3 */
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
  color: var(--gray-600); /* text-gray-4 */
  font-size: 13px;
`;

const RightComponentContainer = styled.div`
  margin-left: auto;
  margin-right: 4px;
`;
