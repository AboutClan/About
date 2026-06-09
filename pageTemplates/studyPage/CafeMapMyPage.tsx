import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

import Divider from "../../components/atoms/Divider";
import Header from "../../components/layouts/Header";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import { useToast } from "../../hooks/custom/CustomToast";
import { useMyPlaceQuery } from "../../hooks/study/queries";
import { useUserInfoQuery } from "../../hooks/user/queries";
import RequestSuggestModal from "../../modals/userRequest/RequestSuggestModal";
import { navigateExternalLink } from "../../utils/navigateUtils";
import { getSafeAreaBottom } from "../../utils/validationUtils";
import UserGatherSectionReview from "../user/UserGatherSectionReview";
import UserProfileBar from "../user/UserProfileBar";
import UserReviewBar from "../user/UserReviewBar";
import UserSocialGuideDrawer from "../user/UserSocialGuideDrawer";

function CafeMapMyPage() {
  const toast = useToast();
  const router = useRouter();
  const { data: userInfo } = useUserInfoQuery();
  const [showTempDrawer, setShowTempDrawer] = useState(false);
  const [showSettingDrawer, setShowSettingDrawer] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);


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
            <UserProfileBar user={userInfo} editUrl="/cafe-map/profile" />

            <Box h="1px" bg="gray.100" />

            {/* 후기 바 */}
            <Box px={5} pt={3}>
              <UserGatherSectionReview />
            </Box>

            {/* A안: 좋아요 한 카페 */}
            <NavCard
              emoji="❤️"
              label="내가 좋아요 한 카페"
              count={0}
              onClick={() => {
                toast("info", "6월 20일부터 이용할 수 있어요!");
              }}
            />

            {/* A안: 카페 아카이브 */}
            <NavCard
              emoji="📁"
              label="내가 만든 카페 아카이브"
              onClick={() => {
                toast("info", "6월 20일부터 이용할 수 있어요!");
              }}
            />

            {/* 구분선 */}
            <Divider />

            {/* 포인트 블록 */}
            <Flex p={4} borderRadius="12px" align="center">
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
                  0P
                </Box>
              </Box>
              <Box
                onClick={() => {
                  toast("info", "6월 20일부터 이용할 수 있어요!");
                }}
              >
                <Flex align="center" gap={0.5} color="gray.400" fontSize="12px">
                  내역 보기
                  <ChevronRightIcon />
                </Flex>
              </Box>
            </Flex>
            <Divider />

            {/* 소셜링 온도 블록 */}
            <Box borderBottom="var(--border)" pb={2} mt={5}>
              <UserReviewBar hasTop={false} user={userInfo} />
            </Box>

            <Box h={10} />
          </>
        )}
      </Box>

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
          </NavBlock>
        </RightDrawer>
      )}

      {showSuggestModal && (
        <RequestSuggestModal type="suggest" setIsModal={() => setShowSuggestModal(false)} />
      )}
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
    <Flex
      px={5}
      py={4}
      align="center"
      justify="space-between"
      borderBottom="var(--border)"
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
        {count !== undefined && (
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
            {count}
          </Flex>
        )}
        <ChevronRightIcon />
      </Flex>
    </Flex>
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
