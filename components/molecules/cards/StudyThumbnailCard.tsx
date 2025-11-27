import { Badge, Box, Button, Flex } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";

import { getStudyBadge } from "../../../libs/study/studyHelpers";
import { SingleLineText } from "../../../styles/layout/components";
import { StudyType } from "../../../types/models/studyTypes/study-set.types";
import { UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat, dayjsToStr } from "../../../utils/dateTimeUtils";
import { CheckCircleIcon } from "../../Icons/CircleIcons";
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
    date: Dayjs | null;
    imageProps: {
      image: string;
      isPriority?: boolean;
    };
    _id: string;
  };
  participants?: UserSimpleInfoProps[];
  url: string;
  studyType: StudyType;
  func?: () => void;
  isMyStudy: boolean;
  isFutureDate?: boolean;
  hasReviewBtn?: boolean;

  hasReview?: boolean;
  hasAttend?: boolean;
}

export function StudyThumbnailCard({
  place,
  participants,
  url,
  studyType,
  func = undefined,
  isMyStudy,
  isFutureDate,
  hasReviewBtn,

  hasReview,
  hasAttend,
}: StudyThumbnailCardProps) {
  const router = useRouter();
  return (
    <CardLink
      href={url}
      onClick={func}
      isbordermain={studyType === "participations" ? "false" : "false"}
    >
      <>
        <PlaceImage size="md" imageProps={place.imageProps} />

        <Flex direction="column" ml={4} flex={1}>
          <Flex justify="space-between">
            <Box>
              <Flex fontSize="10px" align="center" lineHeight="12px" color="gray.600">
                <Box as="span">
                  <LocationDotIcon size="md" />
                </Box>
                <Box as="span" ml={1} mt="0.5px" color="var(--gray-600)">
                  {place.branch}
                </Box>
              </Flex>
              <Title>{place.name}</Title>{" "}
            </Box>
            <Flex align="center" mb="auto">
              {isMyStudy && (
                <Box mr={2}>
                  <CheckCircleIcon color="mint" size="sm" isFill />
                </Box>
              )}
              <Badge
                mr="auto"
                colorScheme={getStudyBadge(studyType, isFutureDate).colorScheme}
                size="md"
              >
                {getStudyBadge(studyType, isFutureDate).text}
              </Badge>
            </Flex>
          </Flex>
          <Subtitle>
            <Flex>
              {place.date && (
                <Box as="span" fontWeight={600}>
                  {dayjsToFormat(dayjs(place.date).locale("ko"), "M.D(ddd)")}
                </Box>
              )}
              {place.date && (
                <Box as="span" color="var(--gray-400)">
                  ・
                </Box>
              )}
              <Box
                as="span"
                textOverflow="ellipsis"
                whiteSpace="wrap"
                maxW={
                  place.branch === "자유 장소" || place.branch === "위치 선정 중..."
                    ? "100%"
                    : "60%"
                }
                overflow="hidden"
                display="-webkit-box"
                sx={{
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {place.address}
              </Box>
            </Flex>
          </Subtitle>
          <Flex mb={1} mt="auto" alignItems="center" justify="space-between">
            <Box>
              <AvatarGroupsOverwrap users={participants} maxCnt={status ? 8 : VOTER_SHOW_MAX} />
            </Box>
            <Flex align="center" color="var(--gray-500)">
              <UserIcon size="sm" />
              <Flex lineHeight="12px" ml={1} fontSize="10px" align="center" fontWeight={500}>
                <Box
                  fontWeight={600}
                  as="span"
                  color={
                    participants.length >= STUDY_MAX_CNT &&
                    studyType !== "participations" &&
                    studyType !== "soloRealTimes"
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
                  {studyType === "soloRealTimes" || studyType === "participations" ? (
                    <Box>
                      <InfinityIcon />
                    </Box>
                  ) : (
                    STUDY_MAX_CNT
                  )}
                </Box>
              </Flex>
            </Flex>
          </Flex>
          {hasReviewBtn && (
            <Button
              mt={3}
              w="max-content"
              ml="auto"
              size="sm"
              colorScheme="black"
              isDisabled={hasReview || !hasAttend}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                router.push(`/home/studyReview?date=${dayjsToStr(place.date)}&id=${place._id}`);
              }}
            >
              {!hasAttend ? "미 출석" : !hasReview ? "멤버 평가" : "평가 완료"}
            </Button>
          )}
        </Flex>
      </>
    </CardLink>
  );
}

export function InfinityIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="12px"
      viewBox="0 -960 960 960"
      width="12px"
      fill="var(--gray-500)"
    >
      <path d="M220-260q-92 0-156-64T0-480q0-92 64-156t156-64q37 0 71 13t61 37l68 62-60 54-62-56q-16-14-36-22t-42-8q-58 0-99 41t-41 99q0 58 41 99t99 41q22 0 42-8t36-22l310-280q27-24 61-37t71-13q92 0 156 64t64 156q0 92-64 156t-156 64q-37 0-71-13t-61-37l-68-62 60-54 62 56q16 14 36 22t42 8q58 0 99-41t41-99q0-58-41-99t-99-41q-22 0-42 8t-36 22L352-310q-27 24-61 37t-71 13Z" />
    </svg>
  );
}

const CardLink = styled(Link)<{ isbordermain: "true" | "false" }>`
  height: fit-content;
  display: flex;
  padding-bottom: 12px;
  padding-right: 0.5px;
  border-bottom: ${(props) =>
    props.isbordermain === "true" ? "var(--border-main)" : "var(--border)"};
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
