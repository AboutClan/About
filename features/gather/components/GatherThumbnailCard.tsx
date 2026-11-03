import { Badge, Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps, useState } from "react";
import styled from "styled-components";

import { UserIcon } from "@/components/Icons/UserIcons";
import { InfinityIcon } from "@/components/molecules/cards/StudyThumbnailCard";
import AvatarGroupsOverwrap from "@/components/molecules/groups/AvatarGroupsOverwrap";
import { getFallbackAvatar } from "@/features/gather/utils/memberDisplay";
import {
  buildRegularApplicants,
  summarizeLocation,
  summarizeSchedule,
} from "@/features/gather/utils/regularGather";
import { useUserInfo } from "@/hooks/custom/UserHooks";
import { SingleLineText } from "@/styles/layout/components";
import {
  GatherCategory,
  GatherStatus,
  IGatherParticipants,
  IRegularContent,
  IRegularFormStats,
  IRegularSlot,
} from "@/types/models/gatherTypes/gatherTypes";
import { UserSimpleInfoProps } from "@/types/models/userTypes/userInfoTypes";
import { isAllAgeRange } from "@/utils/ageUtils";
import { dayjsToFormat } from "@/utils/dateTimeUtils";

const VOTER_SHOW_MAX = 4;
export interface GatherThumbnailCardProps {
  title: string;
  status: string;
  category: string;
  date: string;
  place: string;
  participants?: IGatherParticipants[];
  waitings?: {
    user: UserSimpleInfoProps;
    phase: "first" | "second";
    createdAt?: string;
  }[];
  imageProps: {
    image: string;
    isPriority?: boolean;
  };
  maxCnt: number;
  id: number;
  func?: () => void;
  age: number[];
  gatherType: GatherCategory;
  memberReview: {
    isCompleted: boolean;
    handleBtn: () => void;
  };
  gatherReview: {
    isCompleted: boolean;
    handleBtn: () => void;
  };
  homePath?: boolean;
  disableLink?: boolean;
  /** 상시 행사(regularGather)만 */
  slots?: IRegularSlot[];
  contents?: IRegularContent[];
  formStats?: IRegularFormStats | null;
}

const STATUS_TO_BADGE_PROPS: Record<GatherStatus, { text: string; colorScheme: string }> = {
  open: { text: "모집 마감", colorScheme: "orange" },
  expired: { text: "지난 모임", colorScheme: "black" },
  close: { text: "취소", colorScheme: "gray" },
  today: { text: "오늘 날짜", colorScheme: "blue" },
  pending: { text: "모집중", colorScheme: "mint" },
  end: { text: "종료", colorScheme: "black" },
  planned: { text: "오픈 예정", colorScheme: "purple" },
};

export function GatherThumbnailCard({
  participants,
  waitings,
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
  gatherReview,
  memberReview,
  homePath,
  disableLink,
  slots,
  contents,
  formStats,
}: GatherThumbnailCardProps) {
  const userInfo = useUserInfo();

  const isAdmin = userInfo?.role === "previliged";

  // 상시 행사는 참여자 대신 신청자(구글폼 신청자 + 성비 보정 인원)를 보여 준다.
  // 폼 신청자는 회원과 연결되지 않아 신청자별로 고정된 기본 아바타를 쓴다.
  const participantsMember: IGatherParticipants[] =
    gatherType === "regularGather"
      ? buildRegularApplicants({ id, age, formStats, slots, contents }).map((applicant) => ({
          // 앱에서 신청한 회원은 그 회원의 아바타, 외부 신청자는 고정된 기본 아바타
          user: (applicant.user ?? {
            _id: "",
            avatar: getFallbackAvatar(`${id}-${applicant.id}`),
          }) as unknown as UserSimpleInfoProps,
          phase: "first",
        }))
      : maxCnt !== 1 &&
          gatherType !== "openGather" &&
          gatherType !== "secretGather" &&
          gatherType !== "officialGather"
        ? participants.filter((par) => par.user?._id !== "65df1ddcd73ecfd250b42c89")
        : participants;

  const participantsCnt = participantsMember.reduce(
    (acc, par) => acc + 1 + (par.withCompanion ? 1 : 0),
    0,
  );

  const has = !!(gatherReview || memberReview);

  // 상시 행사는 date가 개설일이라 날짜로 지난 모임/오늘 판정을 하지 않는다.
  const isRegular = gatherType === "regularGather";
  const regularPlace = isRegular ? summarizeLocation(place, contents) : "";

  const statusProps = isRegular
    ? status === "close"
      ? { text: "종료", colorScheme: "gray" }
      : STATUS_TO_BADGE_PROPS.pending
    : STATUS_TO_BADGE_PROPS[
        dayjs(date).isBefore(dayjs().startOf("day"))
          ? "expired"
          : status === "pending"
            ? dayjs(date).startOf("day").isSame(dayjs().startOf("day"))
              ? "today"
              : status
            : status
      ];

  return (
    <CardLink
      href={`/${"gather"}/${id}` + (homePath ? "?path=home" : "")}
      has={has ? "true" : "false"}
      onClick={(e) => {
        // disableLink 인 경우 preventDefault 로 next/link 의 실제 네비게이션을 막는다
        // (Link 는 전달된 onClick 이 e.defaultPrevented 를 만들면 push 하지 않는다).
        if (disableLink) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        func?.();
      }}
    >
      <Flex justify="space-between">
        <PlaceImage src={imageProps.image} priority={imageProps.isPriority} />
        <Flex direction="column" ml="12px" flex={1}>
          <Flex justify="space-between" align="center">
            <Flex>
              <Badge
                mr={1}
                size="md"
                variant="solid"
                colorScheme={
                  gatherType === "event" || gatherType === "official"
                    ? "yellow"
                    : statusProps.colorScheme
                }
              >
                {gatherType === "event"
                  ? "이벤트"
                  : gatherType === "official"
                    ? "공식 행사"
                    : statusProps.text}
              </Badge>

              {gatherType !== "officialGather" && (
                <Badge size="md" colorScheme="gray" color="var(--gray-600)">
                  {category}
                </Badge>
              )}
            </Flex>
            {/* 상시·공식 모임은 오른쪽 위에 신청 인원을 따로 표시하지 않는다(아래 아바타 줄로 대신) */}
            {isRegular || gatherType === "officialGather" ? null : gatherType === "openGather" ? (
              <Badge size="md" ml={1} variant="subtle" colorScheme="blue">
                오픈 번개
              </Badge>
            ) : !isAllAgeRange(age) ? (
              <Badge size="md" variant="subtle" colorScheme="blue">
                만 {age[0]} ~ {age[1]}세
              </Badge>
            ) : null}
            {isAdmin && waitings?.length ? (
              <Box color="mint" fontSize="12px">
                {waitings?.length}명 대기중
              </Box>
            ) : null}
          </Flex>
          <Title>{title}</Title>
          <Subtitle>
            {isRegular ? (
              <>
                <Box as="span">{summarizeSchedule(slots)}</Box>
                {regularPlace && (
                  <>
                    <Box as="span" color="var(--gray-400)">
                      ・
                    </Box>
                    <Box as="span" fontWeight={600}>
                      {regularPlace}
                    </Box>
                  </>
                )}
              </>
            ) : gatherType !== "event" ? (
              <>
                <Box as="span">{dayjsToFormat(dayjs(date).locale("ko"), "M.D(ddd) HH:mm")}</Box>
                <Box as="span" color="var(--gray-400)">
                  ・
                </Box>
                <Box as="span" fontWeight={600}>
                  {place || "온라인"}
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
                    maxCnt !== 0 && participantsCnt >= maxCnt
                      ? "var(--color-red)"
                      : "var(--color-gray)"
                  }
                >
                  {participantsCnt}
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
      </Flex>
      {has && (
        <Flex mt={3} ml="auto">
          <Button
            size="sm"
            mr={2}
            borderColor={gatherReview?.isCompleted ? "inherit" : "gray.800"}
            {...(gatherReview?.isCompleted ? { colorScheme: "mint" } : {})}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              gatherReview?.handleBtn();
            }}
          >
            {gatherReview?.isCompleted ? "모임 후기 보기" : "모임 후기 작성"}
          </Button>
          <Button
            size="sm"
            colorScheme="black"
            isDisabled={memberReview?.isCompleted}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              memberReview?.handleBtn();
            }}
          >
            {!memberReview?.isCompleted ? "멤버 평가" : "평가 완료"}
          </Button>
        </Flex>
      )}
    </CardLink>
  );
}

type PlaceImageProps = Omit<ComponentProps<typeof Image>, "alt" | "sizes" | "fill">;

/** 가로·세로 차이가 이 비율보다 크면 정사각형이 아닌 이미지로 본다 */
const NON_SQUARE_RATIO = 0.02;

function PlaceImage(props: PlaceImageProps) {
  const [imgSrc, setImgSrc] = useState(props?.src || "");
  // 정사각형이 아닌 이미지(주로 4:5 포스터)는 안쪽 얇은 테두리가 작은 썸네일에서 한쪽만 보여서,
  // 12% 확대해 가장자리를 양쪽 약 5.4%씩 잘라 낸다. 실제 크기는 이미지를 불러온 뒤 알므로,
  // 판단 전(null)에는 숨겨 확대 전 모습이 한 번 보였다가 커지는 깜빡임을 막는다.
  const [isNonSquare, setIsNonSquare] = useState<boolean | null>(null);
  return (
    <Box
      aspectRatio={1 / 1}
      borderRadius="var(--rounded-lg)"
      position="relative"
      overflow="hidden"
      pos="relative"
      w="98px"
      h="98px"
      bg="gray.100"
      border="var(--border-main)"
    >
      <Image
        {...props}
        src={imgSrc}
        alt="thumbnailImage"
        sizes="98px"
        fill
        onLoad={(e) => {
          const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
          setIsNonSquare(!!w && !!h && Math.abs(w - h) / Math.max(w, h) > NON_SQUARE_RATIO);
        }}
        onError={() =>
          setImgSrc(
            "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/choosing-perfect-movie.jpg",
          )
        }
        style={{
          // 정사각형이 아닌 이미지는 가운데 기준으로 잘라 채운다
          objectFit: "cover",
          objectPosition: "center",
          ...(isNonSquare && { transform: "scale(1.12)" }),
          ...(isNonSquare === null && { visibility: "hidden" }),
        }}
      />
    </Box>
  );
}

const CardLink = styled(Link)<{ has: "true" | "false" }>`
  height: ${(props) => (props.has === "true" ? "max-content" : "114px")};
  display: flex;
  flex-direction: column;
  padding: 8px;
  padding-right: 12px;
  border: var(--border);
  border-radius: 12px;
  background-color: white;
  &:hover {
    background-color: var(--gray-200);
  }

  margin-bottom: 12px;
`;

const Title = styled(SingleLineText)`
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  margin: 8px 0;
  color: var(--gray-800);
`;

const Subtitle = styled(SingleLineText)`
  color: var(--gray-500);
  font-size: 11px;
  line-height: 16px;
`;
