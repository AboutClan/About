import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps } from "react";
import styled from "styled-components";

import { SingleLineText } from "../../../styles/layout/components";
import { IImageProps } from "../../../types/components/assetTypes";
import { ITextAndColorSchemes } from "../../../types/components/propTypes";
import { UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";
import { SolidBadge } from "../../atoms/badges/SolidBadge";
import AvatarGroupsOverwrap from "../groups/AvatarGroupsOverwrap";

const VOTER_SHOW_MAX = 6;

export interface IPostThumbnailCard {
  participants?: UserSimpleInfoProps[];
  title: string;
  subtitle: string;
  image: IImageProps;
  url: string;
  badge: ITextAndColorSchemes;
  type: "study" | "gather";
  statusText?: string;
  maxCnt?: number;
  func?: () => void;
  registerDate?: string;
  id?: string;
  locationDetail?: string;
}

interface IPostThumbnailCardObj {
  postThumbnailCardProps: IPostThumbnailCard;
  isShort?: boolean;
}

export function GatherThumbnailCard({
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
    registerDate,
    locationDetail,
    id,
  },
  isShort,
}: IPostThumbnailCardObj) {
  const userAvatarArr = participants
    ?.filter((par) => par)
    .map((par) => ({
      image: par.profileImage,
      ...(par.avatar?.type !== null ? { avatar: par.avatar } : {}),
    }));

  const CLOSED_TEXT_ARR = ["모집 마감", "닫힘"];

  return (
    <CardLink href={url} onClick={func}>
      <PlaceImage src={image.url} priority={image.priority} />
      <Flex direction="column" ml="12px" flex={1}>
        {badge && <SolidBadge text={badge.text} colorScheme={badge.colorScheme} />}
        <Title>{title}</Title>
        <Subtitle>
          <Box as="span" color="var(--color-mint)" mr={1}>
            <i className="fa-solid fa-location-dot fa-sm" />
          </Box>
          {subtitle}
        </Subtitle>
        {participants ? (
          <Flex alignItems="center" mt={1}>
            <AvatarGroupsOverwrap
              userAvatarArr={userAvatarArr}
              maxCnt={VOTER_SHOW_MAX - (isShort ? 1 : 0)}
            />

            <Box
              fontSize="14px"
              color="var(--color-mint)"
              fontWeight={600}
              mr="8px"
              mt="4px"
              ml="auto"
            >
              {statusText}
            </Box>
            <Flex
              mb="-2px"
              fontSize="15px"
              align="center"
              color="var(--gray-500)"
              letterSpacing="2px"
            >
              <i className="fa-solid fa-user fa-xs" />
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
                <Box as="span" mr="2px" ml="4px">
                  /
                </Box>
                <span>{maxCnt || <i className="fa-regular fa-infinity" />}</span>
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <Flex mt="auto" color="var(--gray-500)">
            <Box>등록일: </Box>
            <Box>{dayjsToFormat(dayjs(registerDate), "YYYY년 M월 D일")}</Box>
          </Flex>
        )}
      </Flex>
    </CardLink>
  );
}

type PlaceImageProps = Omit<ComponentProps<typeof Image>, "alt" | "sizes" | "fill">;

function PlaceImage(props: PlaceImageProps) {
  return (
    <Box
      aspectRatio={1 / 1}
      borderRadius="var(--rounded-lg)"
      position="relative"
      overflow="hidden"
      pos="relative"
      w="120px"
      h="120px"
    >
      <Image
        {...props}
        alt="thumbnailImage"
        sizes="120px"
        fill
        style={{
          objectFit: "cover",
        }}
      />
    </Box>
  );
}

const CardLink = styled(Link)`
  height: fit-content;
  display: flex;
  padding: 8px;
  border: var(--border);
  border-radius: var(--rounded-lg);
  background-color: white;
  justify-content: space-between;

  &:hover {
    background-color: var(--gray-200);
  }

  &:not(:last-of-type) {
    margin-bottom: 16px;
  }
`;

const Title = styled(SingleLineText)`
  font-weight: 600;
  font-size: 16px;
  margin-top: 8px;
`;

const Subtitle = styled(SingleLineText)`
  color: var(--gray-500);
  font-size: 12px;
  width: 90%;
  margin-top: 8px;
  font-weight: 500;
`;
