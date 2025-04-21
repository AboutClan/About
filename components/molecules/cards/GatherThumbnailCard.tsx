import { Badge, Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps } from "react";
import styled from "styled-components";

import { SingleLineText } from "../../../styles/layout/components";
import { GatherStatus, IGatherParticipants } from "../../../types/models/gatherTypes/gatherTypes";
import { UserIcon } from "../../Icons/UserIcons";
import AvatarGroupsOverwrap from "../groups/AvatarGroupsOverwrap";

const VOTER_SHOW_MAX = 4;
export interface GatherThumbnailCardProps {
  type?: "gather" | "group";
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
  type = "gather",
}: GatherThumbnailCardProps) {
  return (
    <CardLink href={`/${type}/${id}`} onClick={func}>
      <PlaceImage src={imageProps.image} priority={imageProps.isPriority} />
      <Flex direction="column" ml="12px" flex={1}>
        <Flex>
          <Badge mr={1} size="md" colorScheme={STATUS_TO_BADGE_PROPS[status].colorScheme}>
            {STATUS_TO_BADGE_PROPS[status].text}
          </Badge>
          <Badge size="md" colorScheme="gray" color="var(--gray-600)">
            {category}
          </Badge>
        </Flex>
        <Title>{title}</Title>
        <Subtitle>
          <Box as="span">{date}</Box>
          <Box as="span" color="var(--gray-400)">
            ・
          </Box>
          <Box as="span" fontWeight={600}>
            {place}
          </Box>
        </Subtitle>

        <Flex mt={1} alignItems="center" justify="space-between">
          <AvatarGroupsOverwrap
            users={participants?.map((par) => par.user)}
            maxCnt={VOTER_SHOW_MAX}
          />
          <Flex align="center" color="var(--gray-500)">
            <UserIcon size="sm" />
            <Flex ml={1} fontSize="10px" align="center" fontWeight={500}>
              <Box
                fontWeight={600}
                as="span"
                color={
                  maxCnt !== 0 && participants.length >= maxCnt
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
                {maxCnt === 0 ? <i className="fa-regular fa-infinity" /> : maxCnt}
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
        alt="thumbnailImage"
        sizes="98px"
        fill
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
