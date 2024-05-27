import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

import { SingleLineText } from "../../../styles/layout/components";
import { IImageProps } from "../../../types/components/assetTypes";
import { ITextAndColorSchemes } from "../../../types/components/propTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import OutlineBadge from "../../atoms/badges/OutlineBadge";
import Skeleton from "../../atoms/skeleton/Skeleton";
import AvatarGroupsOverwrap from "../groups/AvatarGroupsOverwrap";
export interface IPostThumbnailCard {
  participants: IUserSummary[];
  title: string;
  subtitle: string;
  image: IImageProps;
  url: string;
  badge: ITextAndColorSchemes;
  type: "study" | "gather";
  statusText?: string;
  maxCnt?: number;
  func?: () => void;
}

interface IPostThumbnailCardObj {
  postThumbnailCardProps: IPostThumbnailCard;
}
export function PostThumbnailCard({
  postThumbnailCardProps: {
    participants,
    title,
    subtitle,
    image,
    url,
    badge,
    statusText = undefined,
    maxCnt = undefined,
    func = undefined,
    type,
  },
}: IPostThumbnailCardObj) {
  const userAvatarArr = participants
    .filter((par) => par)
    .map((par) => ({
      image: par.profileImage,
      ...(par.avatar?.type !== null ? { avatar: par.avatar } : {}),
    }));

  const CLOSED_TEXT_ARR = ["모집 마감", "닫힘"];

  return (
    <CardLink href={url} onClick={func}>
      <Flex flex={1}>
        <Box
          w="80px"
          h="80px"
          borderRadius="var(--rounded-lg)"
          position="relative"
          overflow="hidden"
        >
          <Image
            src={image.url}
            alt="thumbnailImage"
            width={80}
            height={80}
            priority={image.priority}
          />
        </Box>
        <Flex direction="column" ml="12px" flex={1}>
          <Flex align="center" fontSize="16px">
            {title !== "개인 스터디" && type === "study" && (
              <Flex mr="4px" w="12px" justify="center" align="center">
                <Box>
                  <i className="fa-regular fa-location-dot fa-sm" />
                </Box>
              </Flex>
            )}
            <Title>{title}</Title>
          </Flex>
          <Subtitle>{subtitle}</Subtitle>
          <StatusContainer>
            <AvatarGroupsOverwrap userAvatarArr={userAvatarArr} size="sm" />
            <div className="statusText">
              <Box color="var(--color-mint)" fontWeight={600} mr="8px" mt="4px">
                {statusText}
              </Box>
            </div>
          </StatusContainer>
        </Flex>
      </Flex>
      <Flex direction="column" justifyContent="space-between" align="flex-end">
        <Box>
          {badge && <OutlineBadge size="sm" text={badge.text} colorScheme={badge.colorScheme} />}
        </Box>
        <Flex
          mb="-2px"
          className="userIconContainer"
          fontSize="15px"
          align="center"
          color="var(--gray-500)"
        >
          <Box>
            <i className="fa-regular fa-user fa-xs" />
          </Box>
          <Flex ml="8px" align="center" fontWeight={500}>
            <Box
              as="span"
              color={
                CLOSED_TEXT_ARR.includes(badge?.text)
                  ? "inherit"
                  : maxCnt && participants.length >= maxCnt
                    ? "var(--color-red)"
                    : "var(--gray-800)"
              }
            >
              {participants.length}
            </Box>
            <Box>
              <Box as="span" mr="2px" ml="4px">
                /
              </Box>
              {maxCnt || <i className="fa-regular fa-infinity" />}
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </CardLink>
  );
}

export function PostThumbnailCardSkeleton() {
  return (
    <SkeletonContainer>
      <SkeletonBlock style={{ width: "80px", height: "80px" }}>
        <Skeleton>t</Skeleton>
      </SkeletonBlock>
      <ContentContainer>
        <TitleHeader style={{ marginBottom: "4px" }}>
          <Box w="60px">
            <Skeleton>temp</Skeleton>
          </Box>
          <Box w="60px">
            <Skeleton>temp</Skeleton>
          </Box>
        </TitleHeader>
        <Box w="40px">
          <Skeleton> temp</Skeleton>
        </Box>
      </ContentContainer>
    </SkeletonContainer>
  );
}

const CardLink = styled(Link)`
  height: 112px;
  display: flex;
  padding: 16px;
  background-color: white;
  border: var(--border);
  border-radius: var(--rounded-lg);
  justify-content: space-between;

  &:hover {
    background-color: var(--gray-200);
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 12px;
`;

const TitleHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled(SingleLineText)`
  font-weight: 600;
`;

const Subtitle = styled(SingleLineText)`
  color: var(--gray-500);
  font-size: 12px;
  width: 90%;
  font-weight: 500;
`;

const StatusContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  margin-bottom: -2px;
  .statusText {
    display: flex;
    margin-left: auto;
    align-items: center;
    color: var(--gray-600); // text-gray-500
    .userIconContainer {
      display: flex;
      align-items: center;
      letter-spacing: 2px;
      > svg {
        margin-bottom: 2px;
      }
      > span:last-child {
        margin-left: 6px;
      }
    }
  }
`;

const SkeletonContainer = styled.div`
  height: 112px;
  display: flex;
  padding: 16px;
  background-color: white;
  border: var(--border);
  border-radius: var(--rounded-lg);

  &:hover {
    background-color: var(--gray-200); // gray-100
  }
`;

const SkeletonBlock = styled.div`
  background-color: var(--gray-200); // gray-200 대응
  border-radius: var(--rounded-lg);
`;
