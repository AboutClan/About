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
import PlaceAvatarImage from "../PlaceAvatarImage";
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
    _id: string;
  };
  participants?: UserSimpleInfoProps[];
  participantCnt?: number;
  url: string;
  status: StudyStatus;
  func?: () => void;
  isAvatarView: boolean;
}

export function StudyThumbnailCard({
  place,
  participants,
  url,
  status,
  func = undefined,
  participantCnt,
  isAvatarView,
}: StudyThumbnailCardProps) {
  console.log("par", participants);
  const userAvatarArr = participants.map((par) => {
    if (!par?.profileImage) console.log("WW", par);
    return {
      image: par.profileImage,
      ...(par.avatar?.type !== null ? { avatar: par.avatar } : {}),
    };
  });
  return (
    <CardLink href={url} onClick={func} isBorderMain={status === "recruiting"}>
      <>
        {status === "recruiting" ? (
          <PlaceAvatarImage size="md" imageProps={place.imageProps} />
        ) : (
          <PlaceImage size="md" imageProps={place.imageProps} />
        )}
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
            <Box>
              <Badge mr="auto" colorScheme={STUDY_STATUS_TO_BADGE[status].colorScheme} size="md">
                {STUDY_STATUS_TO_BADGE[status].text}
              </Badge>
            </Box>
          </Flex>

          <Subtitle>
            <Box>
              <Box as="span" fontWeight={600}>
                {place.distance && `${place.distance}KM`}
              </Box>
              {place.distance && (
                <Box as="span" color="var(--gray-400)">
                  ・
                </Box>
              )}
              <Box as="span">{place.address}</Box>
            </Box>
          </Subtitle>

          <Flex mb={1} mt="auto" alignItems="center" justify="space-between">
            <Box>
              <AvatarGroupsOverwrap
                userAvatarArr={userAvatarArr}
                maxCnt={status === "recruiting" ? 8 : VOTER_SHOW_MAX}
              />
            </Box>
            <Flex align="center" color="var(--gray-500)">
              <UserIcon size="sm" />
              <Flex lineHeight="12px" ml={1} fontSize="10px" align="center" fontWeight={500}>
                <Box
                  fontWeight={600}
                  as="span"
                  color={
                    participantCnt >= STUDY_MAX_CNT && status !== "recruiting"
                      ? "var(--color-red)"
                      : "var(--color-gray)"
                  }
                >
                  {participantCnt}
                </Box>
                <Box as="span" color="var(--gray-400)" mx="2px" fontWeight={300}>
                  /
                </Box>
                <Box as="span" color="var(--gray-500)" fontWeight={500}>
                  {status === "recruiting" ? (
                    <i className="fa-regular fa-infinity" />
                  ) : (
                    STUDY_MAX_CNT
                  )}
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </>
    </CardLink>
  );
}

const CardLink = styled(Link)<{ isBorderMain: boolean }>`
  height: fit-content;
  display: flex;
  padding-bottom: 12px;
  padding-right: 0.5px;
  border-bottom: ${(props) => (props.isBorderMain ? "var(--border-main)" : "var(--border)")};
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
