import { Badge, Box, Flex } from "@chakra-ui/react";
import Link from "next/link";
import styled from "styled-components";

import { STUDY_STATUS_TO_BADGE } from "../../../constants/studyConstants";
import { SingleLineText } from "../../../styles/layout/components";
import { StudyStatus } from "../../../types/models/studyTypes/studyDetails";
import { UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import { LocationDotIcon } from "../../Icons/LocationIcons";
import { UserIcon } from "../../Icons/UserIcons";
import AvatarGroupsOverwrap from "../groups/AvatarGroupsOverwrap";
import PlaceImage from "../PlaceImage";

const VOTER_SHOW_MAX = 4;
export const STUDY_MAX_CNT = 8;

export interface StudyThumbnailCardProps {
  place: {
    name: string;
    branch: string;
    address: string;
    distance: number;
    imageProps: {
      image: string;
      isPriority?: boolean;
    };
  };
  participants?: UserSimpleInfoProps[];
  participantCnt?: number;
  url: string;
  status: StudyStatus;

  func?: () => void;
  id: string;
}

export function StudyThumbnailCard({
  place,
  participants,
  url,
  status,
  func = undefined,
  participantCnt,

  id,
}: StudyThumbnailCardProps) {
  const userAvatarArr = participants
    ?.filter((par) => par)
    .map((par) => ({
      image: par.profileImage,
      ...(par.avatar?.type !== null ? { avatar: par.avatar } : {}),
    }));

  const studyStatus = status === "pending" && participantCnt >= 3 ? "expected" : status;
  
  return (
    <CardLink href={url} onClick={func}>
      {participants ? (
        <>
          <PlaceImage size="md" imageProps={place.imageProps} hasToggleHeart id={id} />
          <Flex direction="column" ml={4} flex={1}>
            {studyStatus === "pending" ? null : (
              <Badge
                mr="auto"
                colorScheme={STUDY_STATUS_TO_BADGE[studyStatus].colorScheme}
                size="md"
              >
                {STUDY_STATUS_TO_BADGE[studyStatus].text}
              </Badge>
            )}
            <Title>{place.name}</Title>
            <Flex>
              <LocationDotIcon size="md" />
              <Subtitle>
                <Box as="span" ml={1} color="var(--gray-600)">
                  {place.branch}
                </Box>
                {place.distance && (
                  <>
                    <Box as="span" color="var(--gray-400)">
                      ・
                    </Box>
                    <Box as="span" fontWeight={600} w="37px">
                      {`${place.distance}KM`}
                    </Box>
                  </>
                )}
                <Box as="span" color="var(--gray-400)">
                  ・
                </Box>{" "}
                <Box as="span">{place.address}</Box>
              </Subtitle>
            </Flex>
            <Flex mt={3} alignItems="center" justify="space-between">
              <AvatarGroupsOverwrap userAvatarArr={userAvatarArr} maxCnt={VOTER_SHOW_MAX} />

              <Flex align="center" color="var(--gray-500)" h={4}>
                <UserIcon size="sm" />
                <Flex ml={1} fontSize="10px" align="center" fontWeight={500}>
                  <Box
                    fontWeight={600}
                    as="span"
                    color={
                      participants.length >= STUDY_MAX_CNT
                        ? "var(--color-red)"
                        : "var(--color-gray)"
                    }
                  >
                    {participants.length}
                  </Box>
                  <Box as="span" color="var(--gray-400)" mx="2px" fontWeight={300}>
                    /
                  </Box>
                  <Box as="span" color="var(--gray-500)" fontWeight={500}>
                    {STUDY_MAX_CNT}
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </>
      ) : (
        <>
          <PlaceImage size="md" imageProps={place.imageProps} hasToggleHeart id={id} />
          <Flex direction="column" ml={4} flex={1}>
            <Flex justify="space-between">
              <Box>
                <Flex fontSize="10px" lineHeight="12px" color="gray.600">
                  <Box as="span">
                    <LocationDotIcon size="md" />
                  </Box>
                  <Box as="span" ml={1} color="var(--gray-600)">
                    {place.branch}
                  </Box>
                </Flex>
                <Title>{place.name}</Title>{" "}
              </Box>
              {studyStatus === "pending" ? null : (
                <Box>
                  <Badge
                    mr="auto"
                    colorScheme={STUDY_STATUS_TO_BADGE[studyStatus].colorScheme}
                    size="md"
                  >
                    {STUDY_STATUS_TO_BADGE[studyStatus].text}
                  </Badge>
                </Box>
              )}
            </Flex>
            <Subtitle>
              <Box>
                <Box as="span" fontWeight={600}>
                  {place.distance && `${place.distance}KM`}
                </Box>
                <Box as="span" color="var(--gray-400)">
                  ・
                </Box>{" "}
                <Box as="span">{place.address}</Box>
              </Box>
            </Subtitle>
            <Flex mt={3} alignItems="center" justify="space-between">
              <Flex align="center" color="var(--gray-500)">
                <UserIcon size="sm" />
                <Flex lineHeight="12px" ml={1} fontSize="10px" align="center" fontWeight={500}>
                  <Box
                    fontWeight={600}
                    as="span"
                    color={
                      participantCnt >= STUDY_MAX_CNT ? "var(--color-red)" : "var(--color-gray)"
                    }
                  >
                    {participantCnt}
                  </Box>
                  <Box as="span" color="var(--gray-400)" mx="2px" fontWeight={300}>
                    /
                  </Box>
                  <Box as="span" color="var(--gray-500)" fontWeight={500}>
                    {STUDY_MAX_CNT}
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </>
      )}
    </CardLink>
  );
}

const CardLink = styled(Link)`
  height: fit-content;
  display: flex;
  padding-right: 12px;
  padding-bottom: 12px;
  border-bottom: var(--border);
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
  line-height: 20px;
`;

const Subtitle = styled(SingleLineText)`
  color: var(--gray-500);
  font-size: 11px;
  line-height: 12px;
`;
