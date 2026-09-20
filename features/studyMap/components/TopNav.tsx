import {
  Box,
  Button,
  Flex,
  Grid,
  IconButton,
  ListItem,
  Portal,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import AlertCirclePoint from "@/components/atoms/AlertCirclePoint";
import CurrentLocationBtn from "@/components/atoms/CurrentLocationBtn";
import { ShortArrowIcon } from "@/components/Icons/ArrowIcons";
import { StarIcon } from "@/components/Icons/StarIcon";
import Header from "@/components/layouts/Header";
import BottomFlexDrawer from "@/components/modals/drawer/BottomFlexDrawer";
import RightDrawer from "@/components/modals/drawer/RightDrawer";
import LocationSearch, { mapxyToLatLng } from "@/components/organisms/location/LocationSearch";
import { usePlaceRankingQuery } from "@/features/study/hooks/queries";
import { CAFE_LIST_SHEET_PEEK } from "@/features/studyMap/components/CafeListSheet";
import GuideButton from "@/features/studyMap/components/GuideButton";
import { CafeMapLogo } from "@/features/studyMap/components/StudyPageMap";
import { NaverLocationProps } from "@/hooks/external/queries";
import { CoordinatesProps, LocationProps } from "@/types/common";
import { DispatchType } from "@/types/hooks/reactTypes";
import { PlaceProps } from "@/types/models/studyTypes/entityTypes";
import { StudyPlaceFilter, StudyPlaceProps } from "@/types/models/studyTypes/study-entity.types";
import { getSafeAreaBottom } from "@/utils/validationUtils";

const MAP_BTN_SHADOW = "0 1px 3px rgba(0, 0, 0, 0.07), 0 2px 8px rgba(0, 0, 0, 0.05)";

const INLINE_FILTER_BUTTONS = [
  {
    label: "콘센트 많음",
    value: "hasManyOutlets",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="16px"
        viewBox="0 -960 960 960"
        width="16px"
        fill="currentColor"
      >
        <path d="M460-200h40v-74l140-140v-186H320v186l140 140v74Zm-80 40v-80L263-357q-11-11-17-25.5t-6-30.5v-187q0-33 23.5-56.5T320-680h40l-40 40v-160q0-17 11.5-28.5T360-840q17 0 28.5 11.5T400-800v120h160v-120q0-17 11.5-28.5T600-840q17 0 28.5 11.5T640-800v160l-40-40h40q33 0 56.5 23.5T720-600v187q0 16-6 30.5T697-357L580-240v80q0 17-11.5 28.5T540-120H420q-17 0-28.5-11.5T380-160Zm100-240Z" />
      </svg>
    ),
  },
  {
    label: "자리 여유",
    value: "isUsuallySpacious",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="16px"
        viewBox="0 -960 960 960"
        width="16px"
        fill="currentColor"
      >
        <path d="M200-120q-17 0-28.5-11.5T160-160v-40q-50 0-85-35t-35-85v-200q0-50 35-85t85-35v-80q0-50 35-85t85-35h400q50 0 85 35t35 85v80q50 0 85 35t35 85v200q0 50-35 85t-85 35v40q0 17-11.5 28.5T760-120q-17 0-28.5-11.5T720-160v-40H240v40q0 17-11.5 28.5T200-120Zm-40-160h640q17 0 28.5-11.5T840-320v-200q0-17-11.5-28.5T800-560q-17 0-28.5 11.5T760-520v160H200v-160q0-17-11.5-28.5T160-560q-17 0-28.5 11.5T120-520v200q0 17 11.5 28.5T160-280Zm120-160h400v-80q0-27 11-49t29-39v-112q0-17-11.5-28.5T680-760H280q-17 0-28.5 11.5T240-720v112q18 17 29 39t11 49v80Zm200 0Zm0 160Zm0-80Z" />
      </svg>
    ),
  },
  {
    label: "심야 운영",
    value: "is24Hours",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="16px"
        viewBox="0 -960 960 960"
        width="16px"
        fill="currentColor"
      >
        <path d="M480-80q-134 0-227-93t-93-227v-200q0-122 96-201t224-79q128 0 224 79t96 201v440q0 33-23.5 56.5T720-80H480Zm0-80h80q-19-25-29.5-55.5T520-280v-42q-10 1-20 1.5t-20 .5q-67 0-129.5-23.5T240-415v15q0 100 70 170t170 70Zm120-120q0 50 35 85t85 35v-255q-26 26-56 44.5T600-340v60ZM480-400q95 0 167.5-55.5T720-600q0-35-12-65.5T674-720q-64 2-109 48t-45 112q0 17-11.5 28.5T480-520q-17 0-28.5-11.5T440-560q0-66-45-111t-109-48q-22 24-34 54t-12 65q0 89 72.5 144.5T480-400ZM311.5-571.5Q300-583 300-600t11.5-28.5Q323-640 340-640t28.5 11.5Q380-617 380-600t-11.5 28.5Q357-560 340-560t-28.5-11.5Zm280 0Q580-583 580-600t11.5-28.5Q603-640 620-640t28.5 11.5Q660-617 660-600t-11.5 28.5Q637-560 620-560t-28.5-11.5ZM370-778q34 14 62 37t48 52q20-29 47.5-52t61.5-37q-25-11-52.5-16.5T480-800q-29 0-56.5 5.5T370-778Zm430 618H520h280Zm-320 0q-100 0-170-70t-70-170q0 100 70 170t170 70h80-80Zm120-120q0 50 35 85t85 35q-50 0-85-35t-35-85ZM480-689Z" />
      </svg>
    ),
  },
  {
    label: "분위기 좋은",
    value: "goodForDate",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="16px"
        viewBox="0 -960 960 960"
        width="16px"
        fill="currentColor"
      >
        <path d="M480-160q-43 0-84-13.5T320-212v52q0 17-11.5 28.5T280-120H80q-17 0-28.5-11.5T40-160v-120q0-34 23.5-57t56.5-23h131q20 0 38 10t29 27q29 39 71.5 61t90.5 22q49 0 91.5-22t70.5-61q13-17 30.5-27t36.5-10h131q34 0 57 23t23 57v120q0 17-11.5 28.5T880-120H680q-17 0-28.5-11.5T640-160v-51q-35 25-75.5 38T480-160ZM160-400q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T280-520q0 50-34.5 85T160-400Zm640 0q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T920-520q0 50-34.5 85T800-400ZM480-834q19-21 45-33.5t54-12.5q51 0 86 35t35 85q0 45-35 93T518-515q-16 15-37.5 15T442-515Q330-619 295-667t-35-93q0-50 35-85t86-35q28 0 54 12.5t45 33.5Zm0 246q72-66 106-107.5t34-64.5q0-17-12-28.5T579-800q-12 0-23.5 7T532-772l-51 59-51-57q-14-16-25.5-23t-23.5-7q-17 0-29 11.5T340-760q0 23 34 64.5T480-588Zm0 0Z" />
      </svg>
    ),
  },
  {
    label: "주차 가능",
    value: "hasParking",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="16px"
        viewBox="0 -960 960 960"
        width="16px"
        fill="currentColor"
      >
        <path d="M400-360v160q0 33-23.5 56.5T320-120q-33 0-56.5-23.5T240-200v-560q0-33 23.5-56.5T320-840h200q100 0 170 70t70 170q0 100-70 170t-170 70H400Zm0-160h128q33 0 56.5-23.5T608-600q0-33-23.5-56.5T528-680H400v160Z" />
      </svg>
    ),
  },
];

/** [기타] 버튼 아이콘 — 임시로 와이파이 아이콘 사용 */
const ETC_FILTER_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16px"
    viewBox="0 -960 960 960"
    width="16px"
    fill="currentColor"
  >
    <path d="M451.5-131.5Q440-143 440-160v-160q0-17 11.5-28.5T480-360q17 0 28.5 11.5T520-320v40h280q17 0 28.5 11.5T840-240q0 17-11.5 28.5T800-200H520v40q0 17-11.5 28.5T480-120q-17 0-28.5-11.5ZM160-200q-17 0-28.5-11.5T120-240q0-17 11.5-28.5T160-280h160q17 0 28.5 11.5T360-240q0 17-11.5 28.5T320-200H160Zm131.5-171.5Q280-383 280-400v-40H160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h120v-40q0-17 11.5-28.5T320-600q17 0 28.5 11.5T360-560v160q0 17-11.5 28.5T320-360q-17 0-28.5-11.5ZM480-440q-17 0-28.5-11.5T440-480q0-17 11.5-28.5T480-520h320q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H480Zm131.5-171.5Q600-623 600-640v-160q0-17 11.5-28.5T640-840q17 0 28.5 11.5T680-800v40h120q17 0 28.5 11.5T840-720q0 17-11.5 28.5T800-680H680v40q0 17-11.5 28.5T640-600q-17 0-28.5-11.5ZM160-680q-17 0-28.5-11.5T120-720q0-17 11.5-28.5T160-760h320q17 0 28.5 11.5T520-720q0 17-11.5 28.5T480-680H160Z" />
  </svg>
);

/** [기타] 바텀시트에서 고르는 필터 — value는 StudyPageMap의 matchesFilters와 짝 */
const ETC_FILTER_OPTIONS = [
  { label: "와이파이 빵빵", value: "hasWifi" },
  { label: "단체석", value: "hasGroupSeats" },
  { label: "좌석 편한", value: "hasComfortableSeats" },
  { label: "가성비", value: "hasGoodValueDrinks" },
  { label: "화장실 깨끗", value: "hasCleanRestroom" },
  { label: "시간제한 없음", value: "noTimeLimit" },
];

export const ARCHIVE_OPTIONS: {
  title: string;
  subtitle: string;
  nickname: string;
  instagram?: string;
}[] = [
  { title: "어바웃님 PICK", subtitle: "항상 자리 여유가 있는 카공 카페 모음", nickname: "어바웃" },
  {
    title: "현님 PICK",
    subtitle: "[대구] 오래 공부하기 좋은 카공 카페 모음",
    nickname: "hyeon",
    instagram: "sh___cs",
  },
  {
    title: "눕눕님 PICK",
    subtitle: "소파가 푹신해서 편안한 카공 카페 모음",
    nickname: "눕눕",
  },
  {
    title: "프로님 PICK",
    subtitle: "작업실에 더 가까운 카공 카페 모음",
    nickname: "프로카공러",
    instagram: "kafe_danigi",
  },
  {
    title: "새벽님 PICK",
    subtitle: "늦게까지 운영해서 오래있기 좋은 카공 카페 모음",
    nickname: "새벽",
  },
];

interface StudyMapNavProps {
  handleCenterLocation: (location: { lat: number; lon: number }, zoomBoost?: number) => void;
  onCafeSearch?: (result: NaverLocationProps) => void;
  openMenu: () => void;
  handleLocationRefetch: () => Promise<CoordinatesProps | null>;
  findNearestPlace: (coords: CoordinatesProps) => StudyPlaceProps | null;
  isMapExpansion: boolean;
  onClose: () => void;
  filterType: StudyPlaceFilter;
  setFilterType: DispatchType<StudyPlaceFilter>;

  openList: () => void;
  isCafeMap: boolean;
  addCafe: () => void;
  hasBackButton?: boolean;
  amenityFilters: string[];
  setAmenityFilters: DispatchType<string[]>;
  selectedPickNickname: string | null;
  setSelectedPickNickname: (n: string | null) => void;
  openAboutDrawer: () => void;
  pickReviewPlace: (place: StudyPlaceProps) => void;
  openReviewForm?: (place: StudyPlaceProps) => void;
  getCurrentLocation: () => Promise<CoordinatesProps | null>;
}

function StudyMapNav({
  handleCenterLocation,
  openMenu,
  handleLocationRefetch,
  findNearestPlace,
  isMapExpansion,
  filterType,
  setFilterType,
  openList,
  hasBackButton,
  onClose,
  isCafeMap,
  addCafe,
  amenityFilters,
  setAmenityFilters,
  selectedPickNickname,
  setSelectedPickNickname,
  openAboutDrawer,
  onCafeSearch,
  pickReviewPlace,
  openReviewForm,
  getCurrentLocation,
}: StudyMapNavProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isFocus, setIsFocus] = useState(true);
  const [updateMenu, setUpdateMenu] = useState(false);
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [isEtcFilterOpen, setIsEtcFilterOpen] = useState(false);

  const { data: rankingData } = usePlaceRankingQuery({ enabled: isRankingOpen });
  const [placeInfo, setPlaceInfo] = useState<LocationProps>({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
  });
  const [extraBottomPadding, setExtraBottomPadding] = useState(0);

  useEffect(() => {
    // Instagram 인앱 브라우저는 env(safe-area-inset-bottom)이 0을 반환
    // 하단 툴바(~49px)를 직접 감지해 보정
    if (typeof window === "undefined") return;
    const isInstagram = /Instagram/.test(navigator.userAgent);
    if (isInstagram) {
      setExtraBottomPadding(49);
    }
  }, []);

  const isRating40Active = filterType === "good";
  const hasActiveFilters = filterType !== "all" || amenityFilters.length > 0;

  const handleResetFilters = () => {
    setFilterType("all");
    setAmenityFilters([]);
    setSelectedPickNickname(null);
  };

  const handleRating40Toggle = () => {
    setFilterType(filterType === "good" ? "all" : "good");
  };

  const toggleAmenity = (value: string) => {
    setAmenityFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const activeEtcCount = ETC_FILTER_OPTIONS.filter((o) => amenityFilters.includes(o.value)).length;

  const resetEtcFilters = () => {
    setAmenityFilters((prev) => prev.filter((v) => !ETC_FILTER_OPTIONS.some((o) => o.value === v)));
  };

  useEffect(() => {
    if (!placeInfo?.latitude) return;
    handleCenterLocation({ lat: placeInfo.latitude, lon: placeInfo.longitude }, 2);
  }, [placeInfo]);

  const handleSearchSelect = (result: NaverLocationProps) => {
    if (result.category?.includes("카페")) {
      const { latitude, longitude } = mapxyToLatLng(result.mapx, result.mapy);
      onCafeSearch?.({ ...result, latitude, longitude });
    }
  };
  return (
    <>
      {/* 상단 헤더 + 검색바 (확장 시에만) */}
      {isMapExpansion && (
        <>
          {!isFocus && (
            <Box
              h="calc(100dvh - 112px)"
              w="full"
              bg="linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 20%)"
              pos="fixed"
              top="112px"
              left={0}
              right={0}
              maxW="var(--max-width)"
              mx="auto"
              zIndex={30}
              pointerEvents="none"
            />
          )}
          <Flex flexDir="column" pb={2} w="full" bg="white" boxShadow="0 2px 12px rgba(0,0,0,0.07)">
            <Flex
              w="full"
              h="64px"
              pl={isCafeMap ? 2 : 0}
              as="header"
              align="center"
              justify="space-between"
              pr={2}
              bg="white"
              maxW="var(--max-width)"
              margin="0 auto"
            >
              {isCafeMap ? (
                <>
                  <Box pl={2} py={2}>
                    <CafeMapLogo />
                  </Box>

                  <Flex
                    as="button"
                    mr={1}
                    align="center"
                    justify="center"
                    w="36px"
                    h="36px"
                    borderRadius="full"
                    flexShrink={0}
                    cursor="pointer"
                    _hover={{ bg: "gray.50" }}
                    _active={{ bg: "gray.100" }}
                    onClick={() => {
                      localStorage.setItem(
                        "cafe-notice",
                        UPDATE_ITEMS.slice().reverse()?.[1]?.date,
                      );
                      setUpdateMenu(true);
                    }}
                    pos="relative"
                  >
                    <Bell size={24} strokeWidth={1.5} color="var(--gray-600)" />
                    {localStorage.getItem("cafe-notice") !==
                      UPDATE_ITEMS.slice().reverse()?.[1]?.date && (
                      <Box
                        position="absolute"
                        right="8px"
                        top="6px"
                        p="1px"
                        bgColor="white"
                        borderRadius="50%"
                      >
                        <AlertCirclePoint isActive={true} />
                      </Box>
                    )}
                  </Flex>
                </>
              ) : (
                <Box w="full">
                  <Header title="카공 지도" func={() => onClose()} isSlide={false} />
                </Box>
              )}
            </Flex>

            <Flex w="full" px={4} bg="white" pb={1} mt={-1}>
              <LocationSearch
                info={placeInfo}
                setInfo={setPlaceInfo}
                size="sm"
                setIsFocus={setIsFocus}
                placeHolder="지역, 카페 이름으로 검색"
                onSelect={handleSearchSelect}
              />
            </Flex>
          </Flex>
          <Flex
            w="100%"
            flexDir="column"
            align="center"
            pos="fixed"
            top="calc(112px)"
            left={0}
            right={0}
            maxW="var(--max-width)"
            mx="auto"
            zIndex={100}
          >
            <Flex
              w="full"
              ref={scrollContainerRef}
              gap={2}
              flex={1}
              px={4}
              overflowX="auto"
              bg="transparent"
              py={3}
              sx={{
                "::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
              }}
            >
              {/* 초기화 버튼 */}
              {/* {hasActiveFilters && (
                <Button
                  flexShrink={0}
                  h="32px"
                  w="32px"
                  p={0}
                  borderRadius="full"
                  bg="white"
                  border="var(--border-main)"
                  boxShadow={MAP_BTN_SHADOW}
                  _hover={{ bg: "gray.100" }}
                  _active={{ opacity: 0.8 }}
                  _focus={{ bg: "white" }}
                  onClick={handleResetFilters}
                >
                  <ResetIcon />
                </Button>
              )} */}

              {/* 카공 조건 필터 버튼들 */}
              {INLINE_FILTER_BUTTONS.map((btn) => (
                <FilterChip
                  key={btn.value}
                  icon={btn.icon}
                  label={btn.label}
                  isActive={amenityFilters.includes(btn.value)}
                  onClick={() => toggleAmenity(btn.value)}
                />
              ))}

              {/* 기타 필터 — 바텀시트에서 선택, 하나라도 켜져 있으면 활성 + 개수 표시 */}
              <FilterChip
                icon={ETC_FILTER_ICON}
                label={activeEtcCount > 0 ? `기타 ${activeEtcCount}` : "기타"}
                isActive={activeEtcCount > 0}
                onClick={() => setIsEtcFilterOpen(true)}
              />
            </Flex>
            {!isMapExpansion && (
              <Button
                borderRadius="4px"
                bgColor="white"
                boxShadow={MAP_BTN_SHADOW}
                w="32px"
                h="32px"
                size="sm"
                p="0"
                border="var(--border-main)"
              >
                <ExpansionIcon />
              </Button>
            )}
          </Flex>
          <Flex
            pos="fixed"
            top="calc(var(--header-h) + 40px + 56px + 16px)"
            left={0}
            right={0}
            maxW="var(--max-width)"
            mx="auto"
            zIndex={100}
            pointerEvents="auto"
            justify="space-between"
            px={4}
          >
            {/* <Box>
              <StatusButton />
            </Box> */}
            <Flex ml="auto" gap={2} align="flex-start">
              {/* 별점 4.0이상 토글 — 선택 시 별 채움, 해제 시 빈 별.
                  별만 두면 즐겨찾기로 오해할 수 있어 '4.0+' 뱃지를 원 아래 테두리에 걸쳐 표시 */}
              <Button
                aria-label="별점 4.0 이상만 보기"
                aria-pressed={isRating40Active}
                pos="relative"
                overflow="visible"
                rounded="full"
                bgColor="white"
                boxShadow={MAP_BTN_SHADOW}
                w="40px"
                h="40px"
                minW="40px"
                p="0"
                border="var(--border-main)"
                borderColor="var(--gray-300)"
                borderWidth="1px"
                onClick={handleRating40Toggle}
                _hover={{ bgColor: "white" }}
                _active={{ bgColor: "white" }}
                _focus={{ bgColor: "white" }}
              >
                <Box mt="-3px" sx={{ svg: { width: "24px", height: "24px" } }}>
                  <StarIcon type={isRating40Active ? "fill" : "empty"} size="lg" />
                </Box>
                <Box
                  as="span"
                  pos="absolute"
                  bottom="-7px"
                  left="50%"
                  transform="translateX(-50%)"
                  px="5px"
                  h="15px"
                  lineHeight="13px"
                  borderRadius="full"
                  fontSize="9px"
                  fontWeight={700}
                  whiteSpace="nowrap"
                  bg={isRating40Active ? "var(--color-mint)" : "white"}
                  color={isRating40Active ? "white" : "gray.600"}
                  border="1px solid"
                  borderColor={isRating40Active ? "var(--color-mint)" : "var(--gray-300)"}
                >
                  4.0+
                </Box>
              </Button>
              {/* 카공지도는 랭킹이 하단 [랭킹] 탭으로 이동 */}
              {!isCafeMap && (
                <Button
                  rounded="full"
                  bgColor="white"
                  boxShadow={MAP_BTN_SHADOW}
                  w="40px"
                  h="40px"
                  minW="40px"
                  size="sm"
                  p="0"
                  border="var(--border-main)"
                  borderColor="var(--gray-300)"
                  borderWidth="1px"
                  onClick={() => setIsRankingOpen(true)}
                  _hover={{ bgColor: "white" }}
                  _active={{ bgColor: "white" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="21px"
                    viewBox="0 -960 960 960"
                    width="21px"
                    fill="var(--gray-800)"
                  >
                    <path d="M536.5-543.5Q560-567 560-600t-23.5-56.5Q513-680 480-680t-56.5 23.5Q400-633 400-600t23.5 56.5Q447-520 480-520t56.5-23.5ZM440-200v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80q0-33 23.5-56.5T360-840h240q33 0 56.5 23.5T680-760h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h120q17 0 28.5 11.5T680-160q0 17-11.5 28.5T640-120H320q-17 0-28.5-11.5T280-160q0-17 11.5-28.5T320-200h120ZM280-528v-152h-80v40q0 38 22 68.5t58 43.5Zm285 93q35-35 35-85v-240H360v240q0 50 35 85t85 35q50 0 85-35Zm115-93q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z" />
                  </svg>
                </Button>
              )}
            </Flex>
          </Flex>
        </>
      )}

      {/* 기타 필터 바텀시트 — 칩을 누르면 바로 적용.
          TopNav는 리스트 시트(CafeListSheet)보다 낮은 stacking context 안에 있어서 zIndex만으로는
          위에 못 뜸 → Portal로 body에 렌더 */}
      {isEtcFilterOpen && (
        <Portal>
          <BottomFlexDrawer
            isDrawerUp
            isOverlay
            height={310}
            isHideBottom
            zIndex={1100}
            setIsModal={() => setIsEtcFilterOpen(false)}
            headerSlot={
              <Flex pt={1} w="100%" align="center">
                <Box flex="1" fontWeight="semibold" fontSize="20px" lineHeight="32px">
                  기타 필터
                </Box>
                {activeEtcCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    fontSize="13px"
                    color="gray.500"
                    onClick={resetEtcFilters}
                  >
                    초기화
                  </Button>
                )}
              </Flex>
            }
            drawerOptions={{
              footer: { text: "닫기", func: () => setIsEtcFilterOpen(false) },
            }}
          >
            <Grid w="full" templateColumns="repeat(2, 1fr)" gap={3} mt={4}>
              {ETC_FILTER_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  isActive={amenityFilters.includes(option.value)}
                  onClick={() => toggleAmenity(option.value)}
                  isFullWidth
                />
              ))}
            </Grid>
          </BottomFlexDrawer>
        </Portal>
      )}

      {/* 카공 랭킹 드로어 */}
      {isRankingOpen && (
        <BottomFlexDrawer
          isDrawerUp
          isOverlay
          height={460}
          isHideBottom
          zIndex={1000}
          setIsModal={() => setIsRankingOpen(false)}
          headerSlot={
            <>
              <Flex pt={1} w="100%" align="center">
                <Box
                  lineHeight="32px"
                  flex="1"
                  minW={0}
                  fontWeight="semibold"
                  fontSize="20px"
                  textAlign="start"
                >
                  카공 랭킹 TOP 100
                </Box>
                <IconButton
                  aria-label="닫기"
                  icon={<XIcon />}
                  variant="ghost"
                  size="sm"
                  ml={2}
                  border="none"
                  cursor="pointer"
                  onClick={() => setIsRankingOpen(false)}
                />
              </Flex>
              <Box color="gray.500" mr="auto" fontSize="12px">
                실제 카공러 후기를 바탕으로 선정한 카공 카페 랭킹
              </Box>
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
            {rankingData?.map((item, idx) => (
              <RankingCafeCard
                key={item.place._id}
                place={item.place}
                rank={idx + 1}
                totalScore={item.totalScore}
                onReviewClick={() => pickReviewPlace(item.place as unknown as StudyPlaceProps)}
              />
            ))}
          </Flex>
        </BottomFlexDrawer>
      )}

      {/* 업데이트 소식 드로어 */}
      {updateMenu && (
        <RightDrawer title="업데이트 소식" onClose={() => setUpdateMenu(false)} isFull={false}>
          <Flex flex={1} overflowY="auto" direction="column" px={4} pt={2}>
            {UPDATE_ITEMS.slice()
              .reverse()
              .map((item) => (
                <UpdateCard key={item.date + item.isCompleted} {...item} />
              ))}
          </Flex>
        </RightDrawer>
      )}

      {/* 하단 버튼 행 (확장 시에만) */}
      {isMapExpansion && (
        <Flex
          flexDir="column"
          pos="absolute"
          w="full"
          // 카공지도는 하단 리스트 시트(peek) 바로 위에 버튼 줄을 띄운다
          bottom={isCafeMap ? `${CAFE_LIST_SHEET_PEEK}px` : 0}
          left={0}
          zIndex={300}
          sx={{ paddingBottom: isCafeMap ? "16px" : getSafeAreaBottom(16 + extraBottomPadding) }}
        >
          <Flex px={4} justify="space-between" align="center">
            {hasBackButton ? (
              <Button
                rounded="full"
                bgColor="white"
                boxShadow={MAP_BTN_SHADOW}
                w="40px"
                h="40px"
                size="sm"
                p="0"
                border="var(--border-main)"
                borderWidth="1px"
                borderColor="var(--gray-300)"
                onClick={() => onClose()}
              >
                <AddCafeIcon2 />
              </Button>
            ) : (
              <Box>
                <CurrentLocationBtn onClick={handleLocationRefetch} isBig={true} />
              </Box>
            )}

            <>
              {!isCafeMap && (
                <Button
                  leftIcon={<MenuIcon />}
                  borderRadius="full"
                  border="var(--border-main)"
                  borderColor="var(--gray-300)"
                  boxShadow={MAP_BTN_SHADOW}
                  bg="white"
                  mt="2px"
                  fontSize="13px"
                  iconSpacing={3}
                  h="40px"
                  onClick={() => openList()}
                >
                  리스트로 보기
                </Button>
              )}

              <Box>
                <GuideButton
                  pickReviewPlace={pickReviewPlace}
                  openReviewForm={openReviewForm}
                  addCafe={addCafe}
                  findNearestPlace={findNearestPlace}
                  getCurrentLocation={getCurrentLocation}
                />
                {/* <Button
                  rounded="full"
                  bgColor="white"
                  boxShadow={MAP_BTN_SHADOW}
                  w="40px"
                  h="40px"
                  minW="40px"
                  size="sm"
                  p="0"
                  border="var(--border-main)"
                  borderColor="var(--gray-300)"
                  borderWidth="1px"
                  onClick={() => addCafe()}
                  _hover={{ bgColor: "white" }}
                  _active={{ bgColor: "white" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="18px"
                    viewBox="0 -960 960 960"
                    width="18px"
                    fill="var(--gray-800)"
                  >
                    <path d="M720-40v-120H600v-80h120v-120h80v120h120v80H800v120h-80ZM80-160v-240H40v-80l40-200h600l40 200v80h-40v120h-80v-120H440v240H80Zm80-80h200v-160H160v160Zm-38-240h516-516ZM80-720v-80h600v80H80Zm42 240h516l-24-120H146l-24 120Z" />
                  </svg>
                </Button> */}
              </Box>
            </>
          </Flex>
        </Flex>
      )}
    </>
  );
}

export default StudyMapNav;

const UPDATE_ITEMS: { isCompleted: boolean; date: string; textArr: string[] }[] = [
  {
    date: "2026-05-17",
    isCompleted: true,
    textArr: [
      "전반적인 UI/UX 및 사용성 개선",
      "FAQ 및 업데이트 소식 기능 추가",
      "장소 추가 및 후기 작성 버그 해결",
      "동일 카페 중복 등록 방지 기능 적용",
      "신규 카공 카페 등록",
    ],
  },
  {
    date: "2026-05-18",
    isCompleted: true,
    textArr: [
      "카페 리뷰 시 닉네임 작성 가능",
      "후기 신뢰도 검증 알고리즘 적용",
      "신규 카공 카페 등록",
    ],
  },
  {
    date: "2026-05-19",
    isCompleted: true,
    textArr: ["실시간 카공 피드 출시 (우측 상단)", "검증된 카공러 PICK 아카이브 추가"],
  },
  {
    date: "2026-05-20",
    isCompleted: true,
    textArr: ["전반적인 UI/UX 및 사용성 개선", "일부 오류 수정 및 안정성 개선"],
  },
  {
    date: "2026-05-24",
    isCompleted: true,
    textArr: ["카공지도 시즌2 대규모 업데이트"],
  },
  {
    date: "2026-05-31",
    isCompleted: true,
    textArr: [
      "카공 카페 등록 편의 개선",
      "AI 기반 실시간 카페 별점 판단",
      "AI 기반 실시간 정보 업데이트",
      "신규 카공 카페 30곳 추가",
      "폐업한 카페 30곳 제거",
    ],
  },
  {
    date: "2026-06-03",
    isCompleted: true,
    textArr: ["AI 기반 알고리즘 강화", "카페 상세 정보 업데이트", "전반적인 UI/UX 및 사용성 개선"],
  },
  {
    date: "2026-06-08",
    isCompleted: true,
    textArr: ["전국 카공 카페 데이터 추가", "스터디 기능 프리뷰 오픈"],
  },
  {
    date: "2026-06-09",
    isCompleted: true,
    textArr: ["마이페이지 기능 업데이트", "카페 저장, 기록 관리, 프로필 기능 등"],
  },

  {
    date: "2026-06-10",
    isCompleted: true,
    textArr: ["속도 개선 (5배 이상 빨라졌어요!)"],
  },
  {
    date: "2026-06-11",
    isCompleted: true,
    textArr: ["타이틀 및 로고 추가", "아이폰 앱 출시"],
  },
  {
    date: "2026-06-17",
    isCompleted: true,
    textArr: [
      "카공 카페 랭킹 기능 추가",
      "신고 및 차단 기능 추가",
      "허위 리뷰 및 관계자성 리뷰 검수 처리",
    ],
  },
  {
    date: "2026-06-20",
    isCompleted: true,
    textArr: ["카페 좋아요 기능 추가", "나만의 아카이브 & 친구 공유하기 기능"],
  },
  {
    date: "2026-07-11",
    isCompleted: true,
    textArr: [
      "장소 추가 및 리뷰 등록 시 '리워드' 지급",
      "카공 후기 작성 흐름의 UI/UX 개선",
      "현재 위치의 카페를 원터치로 자동 탐색하고, 즉시 리뷰를 작성할 수 있는 기능 (베타)",
      "포인트 스토어 출시 (베타)",
    ],
  },
  {
    date: "2026-07-12",
    isCompleted: true,
    textArr: ["안드로이드 앱 출시"],
  },
  {
    date: "2026-08-04",
    isCompleted: true,
    textArr: ["스터디 페이지에 [개인 공부 인증 → 리워드] 기능 추가"],
  },
  {
    date: "2026-09-16",
    isCompleted: true,
    textArr: ["안드로이드에서 [현재 위치 탐색]이 안되던 오류 수정"],
  },
  {
    date: "2026-09-20",
    isCompleted: true,
    textArr: ["카공지도 시즌2 대규모 업데이트"],
  },

  {
    date: "2026-05-18",
    isCompleted: false,
    textArr: ["스터디·커뮤니티 기능 정식 출시"],
  },
];

function UpdateCard({
  isCompleted,
  date,
  textArr,
}: {
  isCompleted: boolean;
  date: string;
  textArr: string[];
}) {
  return (
    <Box bg="gray.50" borderRadius="8px" p={3} border="1px solid" borderColor="gray.100" mb={2}>
      <Flex as="h3" align="flex-start" mb={2} fontSize="14px" fontWeight={700} color="gray.900">
        <Text as="span" color="mint.500" mr={2}>
          {isCompleted ? "[완료]" : "[예정]"}
        </Text>
        {isCompleted ? `${dayjs(date).format("M월 D일")} 업데이트` : "다음 업데이트 예정"}
      </Flex>
      <UnorderedList ml={0}>
        {textArr.map((text, idx) => (
          <ListItem key={text} fontSize="12px" mt={idx === 0 ? 0 : 1.5}>
            {text}
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
}

/** 지도 상단 필터 줄·기타 필터 바텀시트에서 같이 쓰는 칩 버튼 */
function FilterChip({
  label,
  icon,
  isActive,
  onClick,
  isFullWidth,
}: {
  label: string;
  icon?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  /** 그리드 칸을 꽉 채우고 높이·글자를 키움 (기타 필터 바텀시트) */
  isFullWidth?: boolean;
}) {
  return (
    <Button
      w={isFullWidth ? "full" : undefined}
      flexShrink={0}
      h={isFullWidth ? "40px" : "32px"}
      px={3}
      borderRadius="20px"
      boxShadow={MAP_BTN_SHADOW}
      fontSize={isFullWidth ? "12px" : "11px"}
      fontWeight={600}
      lineHeight="12px"
      bg={isActive ? "gray.900" : "white"}
      color={isActive ? "white" : "gray.800"}
      border={isActive ? "none" : "var(--border-main)"}
      _hover={{ bg: isActive ? "gray.900" : "gray.100" }}
      _active={{ opacity: 0.8 }}
      _focus={{ bg: isActive ? "gray.900" : "white" }}
      onClick={onClick}
    >
      <Flex align="center" gap={1}>
        {icon}
        <Box as="span">{label}</Box>
      </Flex>
    </Button>
  );
}

function ResetIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--gray-400)"
    >
      <path d="M440-122q-121-15-200.5-105.5T160-440q0-66 26-126t72-110l57 57q-38 42-56.5 93T240-440q0 88 56 152t144 78v68Zm80 0v-68q87-14 143.5-78.5T720-440q0-100-70-170t-170-70h-3l44 44-56 56-140-140 140-140 56 56-44 44h3q134 0 227 93t93 227q0 121-79.5 211.5T520-122Z" />
    </svg>
  );
}

export function AddCafeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="18px"
      viewBox="0 -960 960 960"
      width="18px"
      fill="var(--gray-800)"
    >
      <path d="M720-160h-80q-17 0-28.5-11.5T600-200q0-17 11.5-28.5T640-240h80v-80q0-17 11.5-28.5T760-360q17 0 28.5 11.5T800-320v80h80q17 0 28.5 11.5T920-200q0 17-11.5 28.5T880-160h-80v80q0 17-11.5 28.5T760-40q-17 0-28.5-11.5T720-80v-80Zm-600 0q-17 0-28.5-11.5T80-200v-200h-7q-19 0-31-14.5T34-448l40-200q3-14 14-23t25-9h534q14 0 25 9t14 23l40 200q4 19-8 33.5T687-400h-7v80q0 17-11.5 28.5T640-280q-17 0-28.5-11.5T600-320v-80H440v200q0 17-11.5 28.5T400-160H120Zm40-80h200v-160H160v160Zm-38-240h516-516Zm-2-240q-17 0-28.5-11.5T80-760q0-17 11.5-28.5T120-800h520q17 0 28.5 11.5T680-760q0 17-11.5 28.5T640-720H120Zm2 240h516l-24-120H146l-24 120Z" />
    </svg>
  );
}

export function AddCafeIcon2() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="var(--gray-800)"
    >
      <path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--gray-800)"
    >
      <path d="M160-240q-17 0-28.5-11.5T120-280q0-17 11.5-28.5T160-320h640q17 0 28.5 11.5T840-280q0 17-11.5 28.5T800-240H160Zm0-200q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h640q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H160Zm0-200q-17 0-28.5-11.5T120-680q0-17 11.5-28.5T160-720h640q17 0 28.5 11.5T840-680q0 17-11.5 28.5T800-640H160Z" />
    </svg>
  );
}

export function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="var(--gray-900)"
    >
      <path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z" />
    </svg>
  );
}

export function ExpansionIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="#424242"
    >
      <path d="M160-120q-17 0-28.5-11.5T120-160v-240q0-17 11.5-28.5T160-440q17 0 28.5 11.5T200-400v144l504-504H560q-17 0-28.5-11.5T520-800q0-17 11.5-28.5T560-840h240q17 0 28.5 11.5T840-800v240q0 17-11.5 28.5T800-520q-17 0-28.5-11.5T760-560v-144L256-200h144q17 0 28.5 11.5T440-160q0 17-11.5 28.5T400-120H160Z" />
    </svg>
  );
}

export function RankingCafeCard({
  place,
  rank,
  totalScore,
  onReviewClick,
}: {
  place: PlaceProps;
  rank: number;
  totalScore: number;
  onReviewClick: () => void;
}) {
  return (
    <Flex
      as="button"
      w="full"
      align="center"
      py={3}
      borderBottom="var(--border-main)"
      gap={3}
      textAlign="left"
      pr={1}
      _hover={{ bg: "gray.50" }}
      _active={{ opacity: 0.7 }}
      onClick={onReviewClick}
    >
      <Box
        fontSize="13px"
        fontWeight={700}
        color={rank <= 3 ? "var(--color-mint)" : "var(--gray-400)"}
        minW="32px"
        textAlign="center"
        flexShrink={0}
      >
        #{rank}
      </Box>
      <Flex direction="column" flex={1} minW={0} gap="3px">
        <Box
          fontSize="14px"
          fontWeight={700}
          lineHeight="20px"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          color="gray.900"
        >
          {place.location?.name}
        </Box>
        <Flex align="center" gap={1}>
          <StarIcon type="fill" size="sm" />
          <Box fontSize="12px" fontWeight={600} color="var(--color-mint)" lineHeight="16px">
            {Number(totalScore.toFixed(2))}
          </Box>
        </Flex>
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

export function StudyIcon({ color }) {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="45"
        viewBox="0 0 37 45"
        fill="none"
      >
        <rect
          x="2"
          y="3"
          width="32"
          height="32"
          rx="16"
          fill={color === "orange" ? "#ffa501" : "#00C2B3"}
        />
        <path
          d="M12.825 25.4829C12.4226 25.3079 12.1105 25.0658 11.8889 24.7567C11.6731 24.4417 11.5652 24.0801 11.5652 23.6718C11.5652 23.3685 11.6439 22.9982 11.8014 22.5607L14.881 14.608C15.1668 13.8789 15.5809 13.319 16.1234 12.9282C16.6716 12.5316 17.2957 12.3333 17.9956 12.3333C18.7014 12.3333 19.3255 12.5316 19.8679 12.9282C20.4162 13.319 20.8332 13.8789 21.119 14.608L24.1986 22.5607C24.3561 23.0215 24.4348 23.3919 24.4348 23.6718C24.4348 24.0801 24.324 24.4417 24.1024 24.7567C23.8866 25.0658 23.5774 25.3079 23.175 25.4829C22.895 25.6053 22.6092 25.6666 22.3176 25.6666C21.9035 25.6666 21.5185 25.5354 21.1627 25.2729C20.8128 25.0104 20.5532 24.6459 20.3841 24.1793L20.1829 23.5843H15.8347L15.6159 24.1793C15.4584 24.6342 15.2018 24.9958 14.846 25.2641C14.4961 25.5324 14.1082 25.6666 13.6824 25.6666C13.3908 25.6666 13.105 25.6053 12.825 25.4829ZM17.0333 19.9798H18.9668L17.9956 16.5065L17.0333 19.9798Z"
          fill="white"
        />
        <path
          d="M18.433 37.3999C18.2405 37.7332 17.7594 37.7332 17.5669 37.3999L15.7699 34.2874C15.5775 33.9541 15.818 33.5374 16.2029 33.5374L19.797 33.5374C20.1819 33.5374 20.4224 33.9541 20.23 34.2874L18.433 37.3999Z"
          fill={color === "orange" ? "#ffa501" : "#00C2B3"}
        />
        <g opacity="0.12" filter="url(#filter0_f_35_316)">
          <ellipse cx="18" cy="41.1499" rx="16" ry="1" fill="#424242" />
        </g>
        <defs>
          <filter
            id="filter0_f_35_316"
            x="0"
            y="38.1499"
            width="36"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_35_316" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
