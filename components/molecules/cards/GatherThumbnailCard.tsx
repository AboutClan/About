import { Badge, Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps, useState } from "react";
import styled from "styled-components";

import { SingleLineText } from "../../../styles/layout/components";
import {
  GatherCategory,
  GatherStatus,
  IGatherParticipants,
} from "../../../types/models/gatherTypes/gatherTypes";
import { UserIcon } from "../../Icons/UserIcons";
import AvatarGroupsOverwrap from "../groups/AvatarGroupsOverwrap";
import { InfinityIcon } from "./StudyThumbnailCard";

const VOTER_SHOW_MAX = 4;
export interface GatherThumbnailCardProps {
  title: string;
  status: string;
  category: string;
  date: string;
  place: string;
  participants?: IGatherParticipants[];
  imageProps: {
    image: string;
    isPriority?: boolean;
  };
  maxCnt: number;
  id: number;
  func?: () => void;
  age: number[];
  gatherType: GatherCategory;
}

const STATUS_TO_BADGE_PROPS: Record<GatherStatus, { text: string; colorScheme: string }> = {
  open: { text: "모집 마감", colorScheme: "red" },
  close: { text: "취소", colorScheme: "gray" },
  pending: { text: "모집중", colorScheme: "mint" },
  end: { text: "종료", colorScheme: "gray" },
  planned: { text: "오픈 예정", colorScheme: "purple" },
};

export function GatherThumbnailCard({
  participants,
  title,
  status,
  category,
  date,
  place,
  imageProps,
  id,
  maxCnt,
  func,

  age,
  gatherType,
}: GatherThumbnailCardProps) {
  const participantsMember = participants.filter(
    (par) => par.user._id !== "65df1ddcd73ecfd250b42c89",
  );

  return (
    <CardLink href={`/${"gather"}/${id}`} onClick={func}>
      <PlaceImage src={imageProps.image} priority={imageProps.isPriority} />
      <Flex direction="column" ml="12px" flex={1}>
        <Flex justify="space-between">
          <Flex>
            <Badge
              mr={1}
              size="md"
              colorScheme={
                gatherType === "event" || gatherType === "official"
                  ? "yellow"
                  : STATUS_TO_BADGE_PROPS[status].colorScheme
              }
            >
              {gatherType === "event"
                ? "이벤트"
                : gatherType === "official"
                ? "공식 행사"
                : STATUS_TO_BADGE_PROPS[status].text}
            </Badge>
            {gatherType === "gather" && (
              <Badge size="md" colorScheme="gray" color="var(--gray-600)">
                {category}
              </Badge>
            )}
          </Flex>
          {(age[0] !== 19 || age[1] !== 28) && (
            <Badge size="md" variant="subtle" colorScheme="blue">
              만 {age[0]} ~ {age[1]}세
            </Badge>
          )}
        </Flex>
        <Title>{title}</Title>
        <Subtitle>
          {gatherType !== "event" ? (
            <>
              <Box as="span">{date}</Box>
              <Box as="span" color="var(--gray-400)">
                ・
              </Box>
              <Box as="span" fontWeight={600}>
                {place}
              </Box>
            </>
          ) : (
            <Box as="span" fontWeight={600}>
              About 이벤트 챌린지
            </Box>
          )}
        </Subtitle>

        <Flex mt={1} alignItems="center" justify="space-between">
          <AvatarGroupsOverwrap
            users={participantsMember?.map((par) => par.user)}
            maxCnt={VOTER_SHOW_MAX}
          />
          <Flex align="center" color="var(--gray-500)">
            <UserIcon size="sm" />
            <Flex ml={1} fontSize="10px" align="center" fontWeight={500}>
              <Box
                fontWeight={600}
                as="span"
                color={
                  maxCnt !== 0 && participantsMember.length >= maxCnt
                    ? "var(--color-red)"
                    : "var(--color-gray)"
                }
              >
                {participantsMember.length}
              </Box>
              <Box as="span" color="var(--gray-400)" mx="2px" fontWeight={300}>
                /
              </Box>
              <Box as="span" color="var(--gray-500)" fontWeight={500}>
                {maxCnt === 0 ? <InfinityIcon /> : maxCnt}
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </CardLink>
  );
}

type PlaceImageProps = Omit<ComponentProps<typeof Image>, "alt" | "sizes" | "fill">;

function PlaceImage(props: PlaceImageProps) {
  const [imgSrc, setImgSrc] = useState(props?.src || "");
  return (
    <Box
      aspectRatio={1 / 1}
      borderRadius="var(--rounded-lg)"
      position="relative"
      overflow="hidden"
      pos="relative"
      w="98px"
      h="98px"
    >
      <Image
        {...props}
        src={imgSrc}
        alt="thumbnailImage"
        sizes="98px"
        fill
        onError={() =>
          setImgSrc(
            "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/choosing-perfect-movie.jpg",
          )
        }
        style={{
          objectFit: "cover",
        }}
      />
    </Box>
  );
}

const CardLink = styled(Link)`
  height: 114px;
  display: flex;
  padding: 8px;
  padding-right: 12px;
  border: var(--border);

  border-radius: 12px;
  background-color: white;
  justify-content: space-between;

  &:hover {
    background-color: var(--gray-200);
  }

  margin-bottom: 12px;
`;

const Title = styled(SingleLineText)`
  font-weight: 700;
  font-size: 14px;
  margin: 8px 0;
  color: var(--gray-800);
`;

const Subtitle = styled(SingleLineText)`
  color: var(--gray-500);
  font-size: 11px;
`;
