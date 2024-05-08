import { Box } from "@chakra-ui/react";
import { faInfinity } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

import { SingleLineText } from "../../../styles/layout/components";
import { IImageProps } from "../../../types/components/assetTypes";
import { ITextAndColorSchemes } from "../../../types/components/propTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import OutlineBadge from "../../atoms/badges/OutlineBadge";
import { UserIcon } from "../../atoms/Icons/icons";
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
  const userAvatarArr = participants
    .filter((par) => par)
    .map((par) => {
      return {
        image: par.profileImage,
        ...(par.avatar?.type !== null ? { avatar: par.avatar } : {}),
      };
    });

  return (
    <CardLink href={url} onClick={func}>
      <Image
        src={image.url}
        alt="thumbnailImage"
        priority={image.priority}
        width={86.5}
        height={86.5}
        style={{ borderRadius: "var(--rounded)" }}
      />
      <ContentContainer>
        <TitleHeader>
          <Title>{title}</Title>
          <OutlineBadge size="sm" text={badge.text} colorScheme={badge.colorScheme} />
        </TitleHeader>
        <Subtitle>{subtitle}</Subtitle>
        <StatusContainer>
          <AvatarGroupsOverwrap userAvatarArr={userAvatarArr} size="sm" />
          <div className="statusText">
            <Box color="var(--color-mint)" fontWeight={600} mr="8px" mt="4px">
              {statusText}
            </Box>
            <div className="userIconContainer">
              <UserIcon />
              <span>
                <Box as="span" color={maxCnt && participants.length > maxCnt && "var(--color-red)"}>
                  {participants.length}
                </Box>
                /{maxCnt || <FontAwesomeIcon icon={faInfinity} />}
              </span>
            </div>
          </div>
        </StatusContainer>
      </ContentContainer>
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
  height: 110px;
  display: flex;
  padding: 12px;
  background-color: white;
  border: var(--border);
  border-radius: var(--rounded-lg);
  box-shadow: var(--shadow);
  &:hover {
    background-color: var(--gray-7); // gray-100
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
  flex: 0.9;
  font-size: 16px;
  font-weight: 600;
`;

const Subtitle = styled(SingleLineText)`
  color: var(--gray-3); // text-gray-500
  font-size: 13px;
  width: 78%;
`;

const StatusContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  .statusText {
    display: flex;
    margin-left: auto;
    align-items: center;
    color: var(--gray-3); // text-gray-500
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
    background-color: var(--gray-7); // gray-100
  }
`;

const SkeletonBlock = styled.div`
  background-color: var(--gray-200); // gray-200 대응
  border-radius: 0.5rem;
`;
