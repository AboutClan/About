import { Box, Button, Flex, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import dayjs from "dayjs";
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import CurrentLocationBtn from "../../../components/atoms/CurrentLocationBtn";
import { StarIcon } from "../../../components/Icons/StarIcon";
import Header from "../../../components/layouts/Header";
import RightDrawer from "../../../components/organisms/drawer/RightDrawer";
import LocationSearch, {
  mapxyToLatLng,
} from "../../../components/organisms/location/LocationSearch";
import { NaverLocationProps } from "../../../hooks/external/queries";
import { LocationProps } from "../../../types/common";
import { DispatchType } from "../../../types/hooks/reactTypes";
import { StudyPlaceFilter } from "../../../types/models/studyTypes/study-entity.types";
import { getSafeAreaBottom } from "../../../utils/validationUtils";
import StatusButton from "./StatusButton";

const MAP_BTN_SHADOW = "0 1px 3px rgba(0, 0, 0, 0.07), 0 2px 8px rgba(0, 0, 0, 0.05)";

const INLINE_FILTER_BUTTONS = [
  {
    label: "콘센트 많음",
    value: "hasGroupSeats",
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
    label: "와이파이 빵빵",
    value: "hasWifi",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="16px"
        viewBox="0 -960 960 960"
        width="16px"
        fill="currentColor"
      >
        <path d="M409-149q-29-29-29-71t29-71q29-29 71-29t71 29q29 29 29 71t-29 71q-29 29-71 29t-71-29Zm213.5-387Q690-512 745-470q20 15 20.5 39.5T748-388q-17 17-42 17.5T661-384q-38-26-84-41t-97-15q-51 0-97 15t-84 41q-20 14-45 13t-42-18q-17-18-17-42.5t20-39.5q55-42 122.5-65.5T480-560q75 0 142.5 24Zm93-223Q826-718 914-643q20 17 21 42t-17 43q-17 17-42 17.5T831-556q-72-59-161.5-91.5T480-680q-100 0-189.5 32.5T129-556q-20 16-45 15.5T42-558q-18-18-17-43t21-42q88-75 198.5-116T480-800q125 0 235.5 41Z" />
      </svg>
    ),
  },
  {
    label: "24시간 운영",
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
  handleLocationRefetch: () => void;
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
}

function StudyMapNav({
  handleCenterLocation,
  openMenu,
  handleLocationRefetch,
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
}: StudyMapNavProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isFocus, setIsFocus] = useState(true);
  const [updateMenu, setUpdateMenu] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
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
                    <svg
                      width="109"
                      height="25"
                      viewBox="0 0 104 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g transform="translate(-1 -0.5) scale(1.08)">
                        {/* Coffee icon */}
                        <path
                          d="M3 7.5H15.5V13.2C15.5 16.1 13.1 18.5 10.2 18.5H8.3C5.4 18.5 3 16.1 3 13.2V7.5Z"
                          stroke="#00C2B3"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.5 9.5H17.2C19 9.5 20.3 10.7 20.3 12.3C20.3 13.9 19 15.1 17.2 15.1H15.5"
                          stroke="#00C2B3"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.2 4.2C6.2 4.2 5.4 3.1 6.3 2"
                          stroke="#00C2B3"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M10 4.2C10 4.2 9.2 3.1 10.1 2"
                          stroke="#00C2B3"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M13.8 4.2C13.8 4.2 13 3.1 13.9 2"
                          stroke="#00C2B3"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />

                        {/* Text */}
                        <text
                          x="27"
                          y="17"
                          fill="#00C2B3"
                          fontSize="18"
                          fontWeight="900"
                          fontFamily="Pretendard, Apple SD Gothic Neo, sans-serif"
                          letterSpacing="-0.8"
                        >
                          카공지도
                        </text>
                      </g>
                    </svg>
                  </Box>
                  <Flex flexDir="column" flex={1} ml={0.5}>
                    <Box fontWeight={700} fontSize="11px" color="gray.800">
                      AI가 분석한 공부하기 좋은 카페
                    </Box>
                    <Box color="gray.500" fontSize="10px" mt="1px">
                      실제 카공러 리뷰{" "}
                      <Box as="span" color="var(--color-mint)" fontWeight={600}>
                        100만개+
                      </Box>{" "}
                      기반
                    </Box>
                  </Flex>
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
                    onClick={() => setUpdateMenu(true)}
                  >
                    <Bell size={24} strokeWidth={1.5} color="var(--gray-800)" />
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
              {hasActiveFilters && (
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
              )}

              {/* 별점 4.0이상 */}
              <Button
                flexShrink={0}
                h="32px"
                px={3}
                borderRadius="20px"
                boxShadow={MAP_BTN_SHADOW}
                fontSize="11px"
                fontWeight={600}
                lineHeight="12px"
                bg={isRating40Active ? "gray.900" : "white"}
                color={isRating40Active ? "white" : "gray.800"}
                border={isRating40Active ? "none" : "var(--border-main)"}
                _hover={{ bg: isRating40Active ? "gray.900" : "gray.100" }}
                _active={{ opacity: 0.8 }}
                _focus={{ bg: isRating40Active ? "gray.900" : "white" }}
                onClick={handleRating40Toggle}
              >
                <Flex align="center" gap={1}>
                  <StarIcon type="fill" size="md" />
                  <Box as="span">별점 4.0+</Box>
                </Flex>
              </Button>

              {/* 나머지 필터 버튼들 */}
              {INLINE_FILTER_BUTTONS.map((btn) => {
                const isActive = amenityFilters.includes(btn.value);
                return (
                  <Button
                    key={btn.value}
                    flexShrink={0}
                    h="32px"
                    px={3}
                    borderRadius="20px"
                    boxShadow={MAP_BTN_SHADOW}
                    fontSize="11px"
                    fontWeight={600}
                    lineHeight="12px"
                    bg={isActive ? "gray.900" : "white"}
                    color={isActive ? "white" : "gray.800"}
                    border={isActive ? "none" : "var(--border-main)"}
                    _hover={{ bg: isActive ? "gray.900" : "gray.100" }}
                    _active={{ opacity: 0.8 }}
                    _focus={{ bg: isActive ? "gray.900" : "white" }}
                    onClick={() => toggleAmenity(btn.value)}
                  >
                    <Flex align="center" gap={1}>
                      {btn?.icon}
                      <Box as="span"> {btn.label}</Box>
                    </Flex>
                  </Button>
                );
              })}

              {/* PICK 아카이브 버튼 */}
              {(() => {
                const isActive = filterType === "about";
                return (
                  <Button
                    flexShrink={0}
                    h="32px"
                    px={3}
                    borderRadius="20px"
                    boxShadow={MAP_BTN_SHADOW}
                    fontSize="11px"
                    fontWeight={600}
                    lineHeight="12px"
                    bg={isActive ? "gray.900" : "white"}
                    color={isActive ? "white" : "gray.800"}
                    border={isActive ? "none" : "var(--border-main)"}
                    _hover={{ bg: isActive ? "gray.900" : "gray.100" }}
                    _active={{ opacity: 0.8 }}
                    _focus={{ bg: isActive ? "gray.900" : "white" }}
                    onClick={() => {
                      if (isActive) {
                        handleResetFilters();
                      } else {
                        setIsArchiveOpen(true);
                      }
                    }}
                  >
                    <Flex align="center" gap={1}>
                      <ArchiveIcon />
                      <Box as="span">PICK 아카이브</Box>
                    </Flex>
                  </Button>
                );
              })()}
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
          <Box
            pos="fixed"
            top="calc(var(--header-h) + 40px + 56px + 16px)"
            left="max(16px, calc((100vw - var(--max-width)) / 2 + 16px))"
            zIndex={100}
            pointerEvents="auto"
          >
            <StatusButton />
          </Box>
        </>
      )}

      {/* PICK 아카이브 선택 바텀시트 */}
      {isArchiveOpen && (
        <>
          <Box
            pos="fixed"
            inset={0}
            zIndex={700}
            bg="rgba(0,0,0,0.45)"
            onClick={() => setIsArchiveOpen(false)}
          />
          <Flex
            pos="fixed"
            left={0}
            right={0}
            bottom={0}
            zIndex={701}
            bg="white"
            borderTopRadius="20px"
            flexDir="column"
            maxW="var(--max-width)"
            mx="auto"
            pb={getSafeAreaBottom(16)}
          >
            {/* 핸들 */}
            <Flex justify="center" pt={3} pb={1}>
              <Box w="56px" h="4px" borderRadius="2px" bg="gray.300" />
            </Flex>
            {/* 타이틀 */}
            <Box fontWeight={700} fontSize="16px" px={5} pt={2} pb={3}>
              PICK 아카이브
            </Box>
            {/* 선택지 */}
            {ARCHIVE_OPTIONS.map((option) => (
              <Flex
                key={option.nickname}
                px={5}
                py={3}
                align="center"
                cursor="pointer"
                _hover={{ bg: "gray.50" }}
                onClick={() => {
                  setSelectedPickNickname(option.nickname);
                  setFilterType("about");
                  setIsArchiveOpen(false);
                }}
              >
                <Box>
                  <Box fontWeight={700} fontSize="14px" color="gray.900">
                    {option.title}
                  </Box>
                  <Box fontSize="12px" color="gray.500" mt="2px">
                    {option.subtitle}
                  </Box>
                </Box>
              </Flex>
            ))}
          </Flex>
        </>
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
          bottom={isCafeMap ? "0px" : 0}
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

              <Box>
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
                </Button>
              </Box>
            </>
          </Flex>
        </Flex>
      )}
    </>
  );
}

export default StudyMapNav;

function ArchiveIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="currentColor"
    >
      <path d="M480-301 240-541l56-56 184 184 184-184 56 56-240 240Zm0-239L240-780l56-56 184 184 184-184 56 56-240 240Z" />
    </svg>
  );
}

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
    date: "2026-05-18",
    isCompleted: false,
    textArr: [
      "기타 업데이트 (6월 9일)",
      "아이폰 앱 출시 (6월 10일)",
      "안드로이드 앱 출시 (6월 20일)",
      "스터디 기능 오픈 (6월 20일) ",
    ],
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
        {textArr.map((text) => (
          <ListItem key={text} fontSize="12px" lineHeight="24px">
            {text}
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
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
