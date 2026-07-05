import { Box, Button, Flex } from "@chakra-ui/react";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

import Divider from "../../components/atoms/Divider";
import Header from "../../components/layouts/Header";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import { useToast } from "../../hooks/custom/CustomToast";
import { useKakaoShare } from "../../hooks/custom/KakaoShareHook2";
import { useMyPlaceFavoritesQuery } from "../../hooks/study/queries";
import { useUserInfoQuery } from "../../hooks/user/queries";
import CafeMapSecedeModal from "../../modals/cafeMap/CafeMapSecedeModal";
import RequestSuggestModal from "../../modals/userRequest/RequestSuggestModal";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import { navigateExternalLink } from "../../utils/navigateUtils";
import { getSafeAreaBottom } from "../../utils/validationUtils";
import UserGatherSectionReview from "../user/UserGatherSectionReview";
import UserProfileBar from "../user/UserProfileBar";
import UserReviewBar from "../user/UserReviewBar";
import UserSocialGuideDrawer from "../user/UserSocialGuideDrawer";
import { CafeCompactCard } from "./CafeListDrawer";
import { StudyReviewDrawer } from "./StudyReviewDrawer";

function CafeMapMyPage() {
  const toast = useToast();
  const router = useRouter();
  const { data: userInfo } = useUserInfoQuery();
  const isGuest = userInfo?.role === "guest";
  const { data: favorites } = useMyPlaceFavoritesQuery();
  const { shareToKakao } = useKakaoShare();
  const [showTempDrawer, setShowTempDrawer] = useState(false);
  const [showSettingDrawer, setShowSettingDrawer] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [showSecedeModal, setShowSecedeModal] = useState(false);
  const [favoriteDrawer, setFavoriteDrawer] = useState<"likes" | "picks" | null>(null);
  const [reviewPlace, setReviewPlace] = useState<StudyPlaceProps | null>(null);

  const temperature = userInfo?.temperature?.temperature ?? 36.5;
  const tempMin = 36.5;
  const tempMax = 44;
  const tempPercent = Math.min(
    100,
    Math.max(0, ((temperature - tempMin) / (tempMax - tempMin)) * 100),
  );
  const tempColor =
    temperature >= 40
      ? "var(--color-mint)"
      : temperature >= 38
      ? "#f97316"
      : temperature >= 36.5
      ? "#facc15"
      : "#ef4444";

  return (
    <>
      <Box
        pos="fixed"
        top={0}
        left={0}
        right={0}
        bottom={getSafeAreaBottom(52)}
        overflowY="auto"
        bg="white"
        maxW="var(--max-width)"
        mx="auto"
        zIndex={500}
      >
        {/* 헤더 */}
        <Header title="내 정보" isBack={false} isSlide={false}>
          <Box as="button" p={1} onClick={() => setShowSettingDrawer(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="var(--color-icon)"
            >
              <path d="M428.46-71.87q-28.2 0-48.54-18.6-20.33-18.6-24.33-45.79l-9-66.24q-11.09-4.28-21.04-10.33-9.94-6.04-19.51-12.84l-61.76 26q-25.95 11.24-52.15 2.12-26.2-9.12-40.67-33.32l-51.55-90.37q-14.48-23.96-8.36-51.03 6.12-27.08 28.08-44.56l52.76-40q-.76-6.04-.76-11.58v-23.18q0-5.54.76-11.58l-52.76-39.76q-22.2-17.48-28.2-44.56-6-27.08 8.48-51.27l51.55-90.13q14.47-23.96 40.55-33.2 26.08-9.24 52.03 2l62.48 26q9.57-6.8 19.65-12.73 10.09-5.92 20.42-10.2l9-66.48q4-27.43 24.33-46.03 20.34-18.6 48.54-18.6h103.08q28.2 0 48.54 18.6 20.33 18.6 24.33 46.03l9 66.48q11.09 4.28 21.04 10.2 9.94 5.93 19.51 12.73l61.76-26q25.95-11.24 52.15-2t40.67 33.2l51.55 90.13q14.48 24.19 8.48 51.27-6 27.08-28.2 44.56l-53 39.76q.76 6.04.76 11.58V-480q0 6.04-.12 11.59-.12 5.54-1.64 11.58l53 39.76q22.2 17.48 28.2 44.56 6 27.08-8.48 51.27l-52.55 90.37q-14.47 23.96-40.55 33.2-26.08 9.24-52.03-2l-60.48-26q-9.57 6.8-19.65 12.84-10.09 6.05-20.42 10.33l-9 66.24q-4 27.19-24.33 45.79-20.34 18.6-48.54 18.6H428.46ZM481.28-340q58 0 99-41t41-99q0-58-41-99t-99-41q-58.76 0-99.38 41t-40.62 99q0 58 40.62 99t99.38 41Z" />
            </svg>
          </Box>
        </Header>

        {userInfo && (
          <>
            {/* 프로필 바 */}
            <UserProfileBar user={userInfo} editUrl="/cafe-map/profile" name={userInfo?.nickname} />

            <Box h="1px" bg="gray.100" />

            {/* 후기 바 */}
            <Box px={5} pt={3}>
              <UserGatherSectionReview />
            </Box>

            <NavCard
              emoji="❤️"
              label="내가 좋아요 한 카페"
              count={favorites?.likes?.length ?? 0}
              onClick={() => setFavoriteDrawer("likes")}
            />

            {/* A안: 카페 아카이브 */}
            <NavCard
              emoji="📁"
              label="내가 만든 카페 아카이브"
              count={favorites?.picks?.length ?? 0}
              onClick={() => setFavoriteDrawer("picks")}
            />

            {/* 구분선 */}
            <Divider />

            <Box>
              <Flex px={5} pt={4} pb={2} align="center">
                <Flex
                  w="44px"
                  h="44px"
                  bg="rgba(0,194,179,0.08)"
                  borderRadius="50%"
                  align="center"
                  justify="center"
                  flexShrink={0}
                >
                  <Image src="/point.png" alt="point" width={28} height={28} />
                </Flex>
                <Box ml={3} flex={1}>
                  <Box fontSize="11px" color="gray.400" mb={0.5}>
                    보유 포인트
                  </Box>
                  <Box fontSize="18px" fontWeight={700} color="gray.900" lineHeight="22px">
                    {userInfo?.role === "previliged" ? "3270P" : "0P"}
                  </Box>
                </Box>
                <Box
                  cursor="pointer"
                  onClick={() => {
                    toast("info", "7월 10일부터 이용할 수 있어요!");
                  }}
                >
                  <Flex align="center" gap={0.5} color="gray.400" fontSize="12px">
                    내역 보기
                    <ChevronRightIcon />
                  </Flex>
                </Box>
              </Flex>
              <Box px={5} pb={4}>
                <Box fontSize="11px" color="var(--color-mint)" fontWeight={500}>
                  카공 리뷰 작성하고 기프티콘으로 받아가세요!
                </Box>
              </Box>
            </Box>
            <Divider />

            <Box borderBottom="var(--border)" pb={2} mt={5}>
              <UserReviewBar hasTop={false} user={userInfo} />
            </Box>

            <Box h={10} />
          </>
        )}
        {isGuest && <CafeMapGuestBottomNav />}
      </Box>

      {favoriteDrawer === "likes" && (
        <RightDrawer title="내가 좋아요 한 카페" onClose={() => setFavoriteDrawer(null)}>
          <ShareBanner
            onClick={() => {
              if (!favorites?.likes?.length) {
                toast("info", "등록한 장소가 없어요");
                return;
              }
              toast("info", "7월 10일 오픈 예정이에요!");
            }}
          />
          {favorites?.likes?.length ? (
            favorites.likes.map((place) => (
              <CafeCompactCard
                key={place._id}
                place={place}
                onReviewClick={() => setReviewPlace(place)}
              />
            ))
          ) : (
            <Box py={10} textAlign="center" color="gray.400" fontSize="14px">
              좋아요한 카페가 없어요
            </Box>
          )}
        </RightDrawer>
      )}

      {favoriteDrawer === "picks" && (
        <RightDrawer title="내가 만든 카페 아카이브" onClose={() => setFavoriteDrawer(null)}>
          <ShareBanner
            onClick={() => {
              if (!favorites?.picks?.length) {
                toast("info", "등록한 장소가 없어요");
                return;
              }
              toast("info", "7월 10일 오픈 예정이에요!");
            }}
          />
          {favorites?.picks?.length ? (
            favorites.picks.map((place) => (
              <CafeCompactCard
                key={place._id}
                place={place}
                onReviewClick={() => setReviewPlace(place)}
              />
            ))
          ) : (
            <Box py={10} textAlign="center" color="gray.400" fontSize="14px">
              아카이브한 카페가 없어요
            </Box>
          )}
        </RightDrawer>
      )}

      {reviewPlace && (
        <StudyReviewDrawer
          placeInfo={reviewPlace}
          onClose={() => setReviewPlace(null)}
          zIndex={4000}
          handleClick={() => setReviewPlace(null)}
        />
      )}

      {showTempDrawer && <UserSocialGuideDrawer onClose={() => setShowTempDrawer(false)} />}

      {showSettingDrawer && (
        <RightDrawer title="메뉴" onClose={() => setShowSettingDrawer(false)}>
          <NavBlock>
            <button onClick={() => navigateExternalLink("https://pf.kakao.com/_SaWXn/chat")}>
              실시간 문의하기
            </button>
            <button
              onClick={() => {
                setShowSettingDrawer(false);
                setShowSuggestModal(true);
              }}
            >
              건의 및 제보하기
            </button>
            <button
              onClick={() => {
                setShowSettingDrawer(false);
                setShowSecedeModal(true);
              }}
            >
              탈퇴하기
            </button>
            <button
              onClick={async () => {
                await signOut({ redirect: false });
                await signIn("guest", {
                  callbackUrl: "/cafe-map",
                }).catch((err) => {
                  console.error("Guest sign-in failed:", err);
                });
              }}
            >
              로그아웃
            </button>
          </NavBlock>
        </RightDrawer>
      )}

      {showSuggestModal && (
        <RequestSuggestModal type="suggest" setIsModal={() => setShowSuggestModal(false)} />
      )}

      {showSecedeModal && <CafeMapSecedeModal setIsModal={() => setShowSecedeModal(false)} />}
    </>
  );
}

function NavCard({
  emoji,
  label,
  count,
  onClick,
}: {
  emoji: string;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <Box borderBottom="var(--border)">
      <Flex
        px={5}
        py={4}
        align="center"
        justify="space-between"
        cursor="pointer"
        onClick={onClick}
        _active={{ bg: "gray.50" }}
      >
        <Flex align="center" gap={3}>
          <Box fontSize="18px" lineHeight="1">
            {emoji}
          </Box>
          <Box fontSize="14px" fontWeight={500} color="gray.800">
            {label}
          </Box>
        </Flex>
        <Flex align="center" gap={2}>
          <Flex
            align="center"
            justify="center"
            bg="var(--color-mint-light)"
            color="var(--color-mint)"
            fontSize="11px"
            fontWeight={700}
            px="7px"
            h="20px"
            borderRadius="10px"
            minW="20px"
          >
            {count || 0}
          </Flex>
          <ChevronRightIcon />
        </Flex>
      </Flex>
    </Box>
  );
}

function ShareBanner({ onClick }: { onClick: () => void }) {
  return (
    <Flex
      my={3}
      px={4}
      py={3}
      align="center"
      gap={3}
      bg="var(--color-mint-light)"
      borderRadius="12px"
      cursor="pointer"
      onClick={onClick}
      _active={{ opacity: 0.7 }}
      borderBottom="var(--border)"
      border="1px solid"
      borderColor="rgba(0,194,179,0.2)"
    >
      <Flex
        w="38px"
        h="38px"
        borderRadius="50%"
        bg="var(--color-mint)"
        align="center"
        justify="center"
        flexShrink={0}
      >
        <ShareIcon color="white" size={18} />
      </Flex>
      <Box flex={1}>
        <Box fontSize="14px" fontWeight={700} color="gray.800">
          친구에게 공유하기
        </Box>
        <Box fontSize="11px" color="gray.500" mt={0.5}>
          내 카페 리스트를 카카오톡으로 공유해요
        </Box>
      </Box>
      <ChevronRightIcon />
    </Flex>
  );
}

function ShareIcon({ color = "var(--gray-400)", size = 16 }: { color?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={`${size}px`}
      viewBox="0 -960 960 960"
      width={`${size}px`}
      fill={color}
    >
      <path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Z" />
    </svg>
  );
}

function SettingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="var(--gray-800)"
    >
      <path d="M428.46-71.87q-28.2 0-48.54-18.6-20.33-18.6-24.33-45.79l-9-66.24q-11.09-4.28-21.04-10.33-9.94-6.04-19.51-12.84l-61.76 26q-25.95 11.24-52.15 2.12-26.2-9.12-40.67-33.32l-51.55-90.37q-14.48-23.96-8.36-51.03 6.12-27.08 28.08-44.56l52.76-40q-.76-6.04-.76-11.58v-23.18q0-5.54.76-11.58l-52.76-39.76q-22.2-17.48-28.2-44.56-6-27.08 8.48-51.27l51.55-90.13q14.47-23.96 40.55-33.2 26.08-9.24 52.03 2l62.48 26q9.57-6.8 19.65-12.73 10.09-5.92 20.42-10.2l9-66.48q4-27.43 24.33-46.03 20.34-18.6 48.54-18.6h103.08q28.2 0 48.54 18.6 20.33 18.6 24.33 46.03l9 66.48q11.09 4.28 21.04 10.2 9.94 5.93 19.51 12.73l61.76-26q25.95-11.24 52.15-2t40.67 33.2l51.55 90.13q14.48 24.19 8.48 51.27-6 27.08-28.2 44.56l-53 39.76q.76 6.04.76 11.58V-480q0 6.04-.12 11.59-.12 5.54-1.64 11.58l53 39.76q22.2 17.48 28.2 44.56 6 27.08-8.48 51.27l-52.55 90.37q-14.47 23.96-40.55 33.2-26.08 9.24-52.03-2l-60.48-26q-9.57 6.8-19.65 12.84-10.09 6.05-20.42 10.33l-9 66.24q-4 27.19-24.33 45.79-20.34 18.6-48.54 18.6H428.46ZM481.28-340q58 0 99-41t41-99q0-58-41-99t-99-41q-58.76 0-99.38 41t-40.62 99q0 58 40.62 99t99.38 41Z" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--gray-400)"
    >
      <path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" />
    </svg>
  );
}

function CafeMapGuestBottomNav() {
  const router = useRouter();

  return (
    <Flex
      position="fixed"
      bottom="0"
      transform={`translateY(calc(-1 * var(--bottom-nav-height) + 1px - ${getSafeAreaBottom(0)}))`}
      w="100%"
      maxW="var(--max-width)"
      bg="gray.50"
      zIndex={601}
      px={4}
      py={2}
      align="center"
      justify="space-between"
      borderTop="1px solid"
      borderColor="gray.200"
      boxShadow="0px -4px 12px rgba(0, 0, 0, 0.05)"
      borderTopRadius="lg"
      fontSize="13px"
      fontWeight="500"
    >
      <Flex direction="column" fontSize="11px" lineHeight="short">
        <Box fontWeight="700" color="gray.700">
          게스트 모드로 둘러보는 중 👀
        </Box>
        <Box color="gray.500">로그인 후에 모든 기능을 무료로 이용할 수 있어요!</Box>
      </Flex>
      <Button size="sm" colorScheme="mint" onClick={() => router.push("/cafe-map/login")}>
        카공지도 시작하기
      </Button>
    </Flex>
  );
}

export default CafeMapMyPage;

const NavBlock = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  > button {
    padding: 16px 12px;
    font-weight: 600;
    text-align: start;
    border-bottom: var(--border);
  }
`;
