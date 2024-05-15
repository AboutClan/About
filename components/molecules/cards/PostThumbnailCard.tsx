import { Box, Flex } from "@chakra-ui/react";
import { faInfinity } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

import LocationDotIcon from "../../../assets/icons/LocationDotIcon";
import UserIcon from "../../../assets/icons/UserIcon";
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
  },
}: IPostThumbnailCardObj) {
  const userAvatarArr = participants.map((par) => {
    return {
      image: par.profileImage,
      ...(par.avatar?.type !== null ? { avatar: par.avatar } : {}),
    };
  });

  return (
    <CardLink href={url} onClick={func}>
      <Flex my="2px" flex={1}>
        <Box w="80px" h="80px" borderRadius="8px" position="relative" overflow="hidden">
          <Image src={image.url} alt="thumbnailImage" sizes="80px" fill={true} loading="lazy" />
        </Box>
        <Flex direction="column" ml="12px" flex={1}>
          <Flex align="center">
            <Flex mr="4px">{title !== "개인 스터디" && <LocationDotIcon />}</Flex>
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
        <OutlineBadge size="sm" text={badge.text} color={badge.color} />
        <Flex className="userIconContainer" align="center">
          <UserIcon />
          <Flex ml="3px" align="center" fontSize="16px" fontWeight={500}>
            <Box as="span" color={maxCnt && participants.length >= maxCnt && "var(--color-red)"}>
              {participants.length}
            </Box>
            <Box color="var(--gray-400)">
              <Box as="span" mx="2px">
                /
              </Box>
              {maxCnt || <FontAwesomeIcon icon={faInfinity} />}
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
      <SkeletonBlock style={{ width: "86.5px", height: "86.5px" }}>
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
  height: 116px;
  display: flex;
  padding: 16px;
  background-color: white;
  border: var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow);
  justify-content: space-between;

  &:hover {
    background-color: var(--gray-200); // gray-100
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 12px; // ml-3 수정
`;

const TitleHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled(SingleLineText)`
  font-size: 14px;
  font-weight: 600;
`;

const Subtitle = styled(SingleLineText)`
  color: var(--gray-600);
  font-size: 12px;
  width: 90%;
  font-weight: 500;

  margin-top: 4px;
`;

const StatusContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;

  .statusText {
    display: flex;
    margin-left: auto;
    align-items: center;
    color: var(--gray-700); // text-gray-500
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
  height: 110px;
  display: flex;
  padding: 12px;
  background-color: white;

  border-radius: var(--rounded-lg);
  box-shadow: var(--shadow);
  &:hover {
    background-color: var(--gray-200); // gray-100
  }
`;

const SkeletonBlock = styled.div`
  background-color: var(--gray-200); // gray-200 대응
  border-radius: 0.5rem;
`;
