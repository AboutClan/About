import { Box, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useQueryClient } from "react-query";
import styled from "styled-components";

import { USER_INFO } from "../../../constants/keys/queryKeys";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useStudyPreferenceMutation } from "../../../hooks/study/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { SingleLineText } from "../../../styles/layout/components";
import { IImageProps } from "../../../types/components/assetTypes";
import { ITextAndColorSchemes } from "../../../types/components/propTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import Skeleton from "../../atoms/skeleton/Skeleton";
export interface IHighlightedThumbnailCard {
  participants?: IUserSummary[];
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
}

const VOTER_SHOW_MAX = 6;

interface IHighlightedThumbnailCardObj {
  highlightedThumbnailCardProps: IHighlightedThumbnailCard;
  isShort?: boolean;
}
export function HighlightedThumbnailCard({
  highlightedThumbnailCardProps: {
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
    id,
  },
  isShort,
}: IHighlightedThumbnailCardObj) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const toast = useToast();
  const isGuest = session?.user.name === "guest";

  const { data: userInfo, isLoading: userLoading } = useUserInfoQuery({
    enabled: isGuest === false,
  });
  const preference = userInfo?.studyPreference;

  const userAvatarArr = participants
    ?.filter((par) => par)
    .map((par) => ({
      image: par.profileImage,
      ...(par.avatar?.type !== null ? { avatar: par.avatar } : {}),
    }));

  const isMyPrefer = preference?.place === id || preference?.subPlace?.includes(id);

  const CLOSED_TEXT_ARR = ["모집 마감", "닫힘"];

  const { mutate: patchStudyPreference, isLoading } = useStudyPreferenceMutation("patch", {
    onSuccess() {
      toast("success", "변경되었습니다.");
      queryClient.refetchQueries([USER_INFO]);
    },
  });

  const toggleHeart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isLoading || userLoading) return;

    const preferMain = preference?.place;

    const preferenceType =
      preference?.place === id
        ? "main"
        : preference?.subPlace?.includes(id)
          ? "sub"
          : preferMain
            ? "sub"
            : "main";

    patchStudyPreference({ id, type: preferenceType });

    queryClient.invalidateQueries([USER_INFO]);
  };

  return (
    <CardLink href={url} onClick={func}>
      <Flex flex={1}>
        <Box
          w="80px"
          h="80px"
          borderRadius="var(--rounded-lg)"
          position="relative"
          overflow="hidden"
          pos="relative"
        >
          <Image
            src={"/실시간.jpg"}
            alt="thumbnailImage"
            fill={true}
            sizes="100px"
            priority={image.priority}
          />
        </Box>
        <Flex direction="column" ml="12px" flex={1}>
          <Flex align="center" fontSize="16px">
            {title !== "개인 스터디" && type === "study" && (
              <Flex mr="8px" w="12px" justify="center" align="center">
                <Box>
                  <i className="fa-regular fa-map-location-dot fa-sm" />
                </Box>
              </Flex>
            )}
            <Title>실시간 스터디</Title>
          </Flex>
          <Subtitle>동네 지도</Subtitle>
          <Flex fontSize="16px" mt="auto" align="center">
            <i className="fa-solid fa-user fa-sm" />
            <Box ml="4px">실시간 현재 인원: 14명</Box>
          </Flex>
        </Flex>
      </Flex>
    </CardLink>
  );
}

export function HighlightedThumbnailCardSkeleton() {
  return (
    <SkeletonContainer>
      <SkeletonBlock style={{ width: "80px", height: "80px" }}>
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
        <Box w="50px" h="16px">
          <Skeleton>temp</Skeleton>
        </Box>
      </ContentContainer>
    </SkeletonContainer>
  );
}

const CardLink = styled(Link)`
  position: relative;
  height: 112px;
  display: flex;
  padding: 16px;
  background-color: white;
  border-radius: var(--rounded-lg); /* 둥근 모서리 */
  justify-content: space-between;

  /* 빗금 패턴 배경 */
  background-image: linear-gradient(
    45deg,
    rgba(0, 194, 179, 0.1) 25%,
    transparent 25%,
    transparent 50%,
    rgba(0, 194, 179, 0.1) 50%,
    rgba(0, 194, 179, 0.1) 75%,
    transparent 75%,
    transparent 100%
  );
  background-size: 10px 10px;

  /* Hover 시 배경색 변경 */
  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  }
  /* 그림자 효과 추가 */
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.05),
    0 4px 6px rgba(0, 0, 0, 0.1);
  /* 3D 입체 효과 */

  /* 가상 요소를 사용해 그라데이션 테두리 추가 */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: var(--rounded-lg); /* 둥근 모서리 */
    padding: 2px; /* 테두리 두께 */
    background: linear-gradient(to right, var(--color-mint), var(--color-blue)); /* 그라데이션 */
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: destination-out;
    pointer-events: none; /* 클릭 방지 */
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  margin-left: 12px;
`;

const TitleHeader = styled.div`
  height: 20px;
  display: flex;
  justify-content: space-between;
`;

const Title = styled(SingleLineText)`
  font-weight: 600;
`;

const Subtitle = styled(SingleLineText)`
  color: var(--gray-500);
  font-size: 12px;
  width: 90%;
  font-weight: 500;
`;

const StatusContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  margin-bottom: -2px;
  .statusText {
    display: flex;
    margin-left: auto;
    align-items: center;
    color: var(--gray-600); // text-gray-500
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
  height: 112px;
  display: flex;
  padding: 16px;
  background-color: white;
  border: var(--border);
  border-radius: var(--rounded-lg);

  &:hover {
    background-color: var(--gray-200); // gray-100
  }
`;

const SkeletonBlock = styled.div`
  background-color: var(--gray-200); // gray-200 대응
  border-radius: var(--rounded-lg);
`;
