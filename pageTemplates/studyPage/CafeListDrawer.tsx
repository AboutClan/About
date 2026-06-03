import { Box, Flex, IconButton } from "@chakra-ui/react";
import dayjs from "dayjs";

import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import { StarIcon } from "../../components/Icons/StarIcon";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import { getPlaceScore } from "../../libs/study/studyUtils";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import { XIcon } from "./studyPageMap/TopNav";

interface CafeListDrawerProps {
  onClose: () => void;
  placeData: StudyPlaceProps[];
  pickReviewPlace: (place: StudyPlaceProps) => void;
  type: "ids" | "drawer" | "about";
  radiusKm?: number;
  pickNickname?: string;
  pickTitle?: string;
  pickSubtitle?: string;
  pickInstagram?: string;
}

export function CafeListDrawer({
  onClose,
  placeData,
  pickReviewPlace,
  type,
  radiusKm,
  pickNickname,
  pickTitle,
  pickSubtitle,
  pickInstagram,
}: CafeListDrawerProps) {
  const formatRadius = (km: number) => {
    if (!Number.isFinite(km) || km <= 0) return "100m";
    const meter = Math.max(100, Math.round(km * 1000));
    if (meter < 1000) return `${meter}m`;
    return `${Math.round(km)}km`;
  };

  return (
    <>
      <BottomFlexDrawer
        isDrawerUp
        isOverlay
        height={460}
        isHideBottom
        zIndex={1000}
        setIsModal={onClose}
        headerSlot={
          <>
            <Flex pt={1} w="100%" align="center ">
              <Box
                lineHeight="32px"
                flex="1"
                minW={0}
                fontWeight="semibold"
                fontSize="20px"
                textAlign="start"
              >
                {type === "about"
                  ? pickTitle ?? `${pickNickname ?? "어바웃"}님 PICK`
                  : type === "drawer"
                  ? "근처에 있는 카공 카페"
                  : "해당 위치 카공 카페"}
              </Box>
              <IconButton
                aria-label="닫기"
                icon={<XIcon />}
                variant="ghost"
                size="sm"
                ml={2}
                border="none"
                cursor="pointer"
                onClick={onClose}
              />
            </Flex>
            <Box color="gray.500" mr="auto" fontSize="12px">
              {type === "about" ? (
                <>
                  {pickSubtitle ?? ""} <b>{placeData?.length}개</b>
                </>
              ) : type === "drawer" ? (
                <>
                  반경 <b>{formatRadius(radiusKm ?? 0)}</b>에 <b>{placeData?.length}개</b>의 카공
                  카페가 있어요!
                </>
              ) : (
                <>
                  해당 위치에 <b>{placeData?.length}개</b>의 카공 카페가 있어요!
                </>
              )}
            </Box>
            {type === "about" && pickInstagram && (
              <Flex align="center" gap={1.5} mt="6px" mr="auto">
                <InstagramIcon />
                <Box
                  as="a"
                  href={`https://instagram.com/${pickInstagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  fontSize="12px"
                  fontWeight={600}
                  color="gray.600"
                  _hover={{ textDecoration: "underline" }}
                >
                  {pickInstagram}
                </Box>
              </Flex>
            )}
          </>
        }
      >
        <Flex
          flexDir="column"
          w="full"
          mt={3}
          flex="1"
          minH={0}
          overflowY="auto"
          borderTop="var(--border-main)"
          sx={{
            "::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
            touchAction: "pan-y",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {placeData?.map((place) => (
            <CafeCompactCard
              key={place._id}
              place={place}
              onReviewClick={() => pickReviewPlace(place)}
            />
          ))}
        </Flex>
      </BottomFlexDrawer>
    </>
  );
}

function CafeCompactCard({
  place,
  onReviewClick,
}: {
  place: StudyPlaceProps;
  onReviewClick: () => void;
}) {
  const rating = getPlaceScore(place.ratings).total;
  const reviewCnt =
    (place.ratings?.length || 0) + 2 + Number(place?.location?.latitude?.toString().slice(-1));

  const hour = place.operatingHours?.[0]?.[1] ?? "";
  const isOpen = (() => {
    if (!hour) return null;
    const [start, end] = hour.split(" - ");
    const now = dayjs().format("HH:mm");
    return now >= start && now <= end;
  })();

  return (
    <Flex
      as="button"
      w="full"
      align="center"
      py={3}
      borderBottom="var(--border-main)"
      gap={3}
      textAlign="left"
      _hover={{ bg: "gray.50" }}
      _active={{ opacity: 0.7 }}
      onClick={onReviewClick}
      pr={1}
    >
      <Flex direction="column" flex={1} minW={0} gap="3px">
        {/* 카페명 + PICK 배지 */}
        <Flex align="center" gap={2} minW={0}>
          <Box
            fontSize="14px"
            fontWeight={700}
            lineHeight="20px"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            color="gray.900"
          >
            {place.location.name}
          </Box>
        </Flex>

        {/* 별점 + 평가자 수 */}
        <Flex align="center" gap={1}>
          <StarIcon type="fill" size="sm" />
          <Box fontSize="12px" fontWeight={600} color="var(--color-mint)" lineHeight="16px">
            {rating.toFixed(1)}
          </Box>
          <Box fontSize="11px" color="gray.400" lineHeight="16px">
            ({reviewCnt}명 평가)
          </Box>
        </Flex>

        {/* 영업 상태 + 영업 시간 */}
        {hour && (
          <Flex align="center" gap={1}>
            <Box
              fontSize="11px"
              fontWeight={600}
              color={isOpen ? "green.500" : "gray.400"}
              lineHeight="16px"
            >
              {isOpen ? "영업중" : "영업 종료"}
            </Box>
            <Box fontSize="11px" color="gray.400" lineHeight="16px">
              · {hour}
            </Box>
          </Flex>
        )}

        {/* 주소 */}
        <Box
          fontSize="11px"
          color="gray.400"
          lineHeight="16px"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {place.location.address}
        </Box>
      </Flex>
      <ShortArrowIcon dir="right" />
    </Flex>
  );
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C13584"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="#C13584" stroke="none" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="18px"
      viewBox="0 -960 960 960"
      width="18px"
      fill="var(--gray-300)"
      style={{ flexShrink: 0 }}
    >
      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
    </svg>
  );
}
