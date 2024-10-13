import { Badge, Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Link from "next/link";
import styled from "styled-components";

import { SingleLineText } from "../../../styles/layout/components";
import { ITextAndColorSchemes } from "../../../types/components/propTypes";
import { UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";
import { UserIcon } from "../../Icons/UserIcons";
import AvatarGroupsOverwrap from "../groups/AvatarGroupsOverwrap";
import PlaceImage from "../PlaceImage";

const VOTER_SHOW_MAX = 4;
const STUDY_MAX_CNT = 8;

export interface StudyThumbnailCardInfoProps {
  place: {
    fullname: string;
    branch: string;
    address: string;
    distance: number;
    imageProps: {
      image: string;
      isPriority?: boolean;
    };
  };

  participants?: UserSimpleInfoProps[];

  url: string;
  badge: ITextAndColorSchemes;

  statusText?: string;
  maxCnt?: number;
  func?: () => void;
  registerDate?: string;
  id?: string;
}

interface StudyThumbnailCardProps {
  cardInfo: StudyThumbnailCardInfoProps;
  isShort?: boolean;
}

export function StudyThumbnailCard({
  cardInfo: {
    place,
    participants,

    url,
    badge,
    statusText = undefined,
    maxCnt = undefined,
    func = undefined,

    registerDate,

    id,
  },
  isShort,
}: StudyThumbnailCardProps) {
  const userAvatarArr = participants
    ?.filter((par) => par)
    .map((par) => ({
      image: par.profileImage,
      ...(par.avatar?.type !== null ? { avatar: par.avatar } : {}),
    }));

  return (
    <Box pb={3} borderBottom="var(--border)">
      <CardLink href={url} onClick={func}>
        <PlaceImage size="md" imageProps={place.imageProps} hasToggleHeart id={id} />
        <Flex direction="column" ml={4} flex={1}>
          <Badge mr="auto" colorScheme={badge.colorScheme} size="md">
            자유참여
          </Badge>

          <Title>{place.fullname}</Title>
          <Subtitle>
            <Box>
              <Box as="span">
                <i
                  className="fa-solid fa-location-dot fa-sm"
                  style={{ color: "var(--color-mint)" }}
                />
              </Box>
              <Box as="span" ml={1} color="var(--gray-600)">
                {place.branch}
              </Box>
              <Box as="span" color="var(--gray-400)">
                ・
              </Box>
              <Box as="span" fontWeight={600}>
                {place.distance}KM
              </Box>
              <Box as="span" color="var(--gray-400)">
                ・
              </Box>{" "}
              <Box as="span">{place.address}</Box>
            </Box>
          </Subtitle>
          {participants ? (
            <Flex mt={3} alignItems="center" justify="space-between">
              <AvatarGroupsOverwrap
                userAvatarArr={userAvatarArr}
                maxCnt={VOTER_SHOW_MAX - (isShort ? 1 : 0)}
              />

              <Flex align="center" color="var(--gray-500)">
                <UserIcon size="sm" />
                <Flex ml={1} fontSize="10px" align="center" fontWeight={500}>
                  <Box
                    fontWeight={600}
                    as="span"
                    color={
                      maxCnt && participants.length >= maxCnt
                        ? "var(--color-red)"
                        : "var(--color-gray)"
                    }
                  >
                    {participants.length}
                  </Box>
                  <Box as="span" color="var(--gray-400)" mx="2px" fontWeight={300}>
                    /
                  </Box>
                  <Box as="span" color="var(--gray-500)">
                    {STUDY_MAX_CNT}
                  </Box>
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
    </Box>
  );
}

const CardLink = styled(Link)`
  height: fit-content;
  display: flex;
  padding-right: 12px;

  background-color: white;
  justify-content: space-between;

  &:hover {
    background-color: var(--gray-200);
  }

  &:not(:last-of-type) {
    border-bottom: var(--border);
  }
`;

const Title = styled(SingleLineText)`
  margin: 4px 0;
  font-size: 14px;
  font-weight: 600;
`;

const Subtitle = styled(SingleLineText)`
  color: var(--gray-500);
  font-size: 11px;
`;
