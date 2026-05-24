import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MouseEvent, ReactNode, RefObject, useEffect, useRef, useState } from "react";

import CurrentLocationBtn from "../../../components/atoms/CurrentLocationBtn";
import { ShortArrowIcon } from "../../../components/Icons/ArrowIcons";
import { StarIcon } from "../../../components/Icons/StarIcon";
import Header from "../../../components/layouts/Header";
import BottomFlexDrawer from "../../../components/organisms/drawer/BottomFlexDrawer";
import LocationSearch, {
  mapxyToLatLng,
} from "../../../components/organisms/location/LocationSearch";
import { AboutLogo } from "../../../components/services/AboutLogo";
import { useToast } from "../../../hooks/custom/CustomToast";
import { NaverLocationProps } from "../../../hooks/external/queries";
import { useOverlayRouter } from "../../../hooks/useOverlayRouter";
import { LocationProps } from "../../../types/common";
import { DispatchType } from "../../../types/hooks/reactTypes";
import {
  StudyPlaceFilter,
  StudyPlaceProps,
} from "../../../types/models/studyTypes/study-entity.types";
import { getSafeAreaBottom } from "../../../utils/validationUtils";
import GuideButton from "./GuideButton";
import StatusButton from "./StatusButton";

const MAP_BTN_SHADOW = "0 1px 4px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.08)";

const RATING_OPTIONS: { label: string; value: string; filterType: StudyPlaceFilter }[] = [
  { label: "전체", value: "all", filterType: "all" },
  { label: "4.5점 이상", value: "4.5", filterType: "best" },
  { label: "4.0점 이상", value: "4.0", filterType: "good" },
  { label: "3.5점 이상", value: "3.5", filterType: "bad" },
];

const AMENITY_OPTIONS = [
  { label: "단체석 보유", value: "hasGroupSeats" },
  { label: "와이파이 빵빵", value: "hasWifi" },
  { label: "24시간 운영", value: "is24Hours" },
  { label: "주차 가능", value: "hasParking" },
  { label: "자리 여유", value: "isUsuallySpacious" },
];

export const ARCHIVE_OPTIONS: { title: string; subtitle: string; nickname: string }[] = [
  { title: "어바웃님 PICK", subtitle: "항상 자리 여유가 있는 카공 카페 모음", nickname: "어바웃" },
  {
    title: "눕눕님 PICK",
    subtitle: "소파가 푹신해서 편안한 카공 카페 모음",
    nickname: "눕눕",
  },
  {
    title: "프로님 PICK",
    subtitle: "작업실에 더 가까운 카공 카페 모음",
    nickname: "새벽",
  },
  {
    title: "새벽님 PICK",
    subtitle: "늦게까지 운영해서 오래있기 좋은 카공 카페 모음",
    nickname: "새벽",
  },
];

interface FilterButtonProps {
  type: StudyPlaceFilter;
  filterType: StudyPlaceFilter;
  onFilter: (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    type: StudyPlaceFilter,
  ) => void;
  activeColor?: string;
  btnRef?: RefObject<HTMLButtonElement>;
  children: ReactNode;
}

function FilterButton({
  type,
  filterType,
  onFilter,
  activeColor = "gray.900",
  btnRef,
  children,
}: FilterButtonProps) {
  const isActive = filterType === type;
  const bg = isActive ? activeColor : "white";
  return (
    <Button
      ref={btnRef}
      flexShrink={0}
      h="32px"
      px={4}
      borderRadius="20px"
      boxShadow={MAP_BTN_SHADOW}
      fontSize="11px"
      fontWeight={600}
      lineHeight="12px"
      bg={bg}
      color={isActive ? "white" : "gray.800"}
      border={isActive ? "none" : "var(--border)"}
      _hover={{ bg: isActive ? activeColor : "gray.100" }}
      _active={{ opacity: 0.8 }}
      _focus={{ bg }}
      onClick={(e) => onFilter(e, type)}
    >
      {children}
    </Button>
  );
}

interface StudyMapNavProps {
  handleCenterLocation: (location: { lat: number; lon: number }, zoomBoost?: number) => void;
  onCafeSearch?: (result: NaverLocationProps) => void;
  openMenu: () => void;
  handleLocationRefetch: () => void;
  isMapExpansion: boolean;
  onClose: () => void;
  filterType: StudyPlaceFilter;
  setFilterType: DispatchType<StudyPlaceFilter>;
  isMainType?: boolean;
  openList: () => void;
  isCafeMap: boolean;
  addCafe: () => void;
  hasBackButton?: boolean;
  pickReviewPlace: (place: StudyPlaceProps) => void;
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
  isMainType,
  openList,
  hasBackButton,
  onClose,
  isCafeMap,
  pickReviewPlace,
  amenityFilters,
  setAmenityFilters,
  selectedPickNickname,
  setSelectedPickNickname,
  openAboutDrawer,
  onCafeSearch,
}: StudyMapNavProps) {
  const router = useRouter();
  const { updateQuery } = useOverlayRouter();
  const toast = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const aboutBtnRef = useRef<HTMLButtonElement>(null);

  const [isFocus, setIsFocus] = useState(true);
  const [placeInfo, setPlaceInfo] = useState<LocationProps>({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
  });

  const isFilterOpen = router.query.modal === "ratingFilter";
  const isAmenityOpen = router.query.modal === "amenityFilter";
  const isArchiveOpen = router.query.modal === "archiveFilter";

  const isAmenityActive = amenityFilters.length > 0;
  const isArchiveActive = filterType === "about" && selectedPickNickname !== null;
  const activeArchive = ARCHIVE_OPTIONS.find((o) => o.nickname === selectedPickNickname) ?? null;

  const toggleAmenity = (value: string) => {
    if (filterType === "about") {
      setSelectedPickNickname(null);
      setFilterType("all");
    }
    setAmenityFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const selectedRatingOption =
    RATING_OPTIONS.find((o) => o.filterType === filterType && filterType !== "all") ?? null;
  const ratingButtonLabel = selectedRatingOption ? selectedRatingOption.label : "별점";
  const isRatingActive = !!selectedRatingOption;

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

  const handleFilter = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    type: StudyPlaceFilter,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.blur();
    setFilterType(filterType === type ? "all" : type);
  };

  useEffect(() => {
    if (filterType !== "about" || !scrollContainerRef.current || !aboutBtnRef.current) return;
    const container = scrollContainerRef.current;
    const btn = aboutBtnRef.current;
    const scrollLeft = btn.offsetLeft + btn.offsetWidth - container.clientWidth + 16;
    container.scrollTo({ left: Math.max(0, scrollLeft), behavior: "smooth" });
  }, [filterType]);

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
              zIndex={30}
              pointerEvents="none"
            />
          )}
          <Flex flexDir="column" w="full" bg="white">
            <Flex
              w="full"
              h="var(--header-h)"
              pl={isCafeMap ? 3 : 0}
              as="header"
              align="center"
              justify="space-between"
              pr={2}
              bg="white"
              maxW="var(--max-width)"
              margin="0 auto"
              borderColor="gray.100"
            >
              {isCafeMap ? (
                <>
                  <Box px={2} py={2}>
                    <AboutLogo />
                  </Box>
                  <Flex align="center" mr={1}>
                    <Button variant="unstyled" p={2} onClick={() => openMenu()}>
                      <MenuIcon2 />
                    </Button>
                  </Flex>
                </>
              ) : (
                <Box w="full">
                  <Header title="카공 지도" func={() => onClose()} isSlide={false} />
                </Box>
              )}
            </Flex>

            <Flex w="full" px={5} bg="white">
              <LocationSearch
                info={placeInfo}
                setInfo={setPlaceInfo}
                size="sm"
                setIsFocus={setIsFocus}
                placeHolder="찾고 싶은 지역 검색"
                onSelect={handleSearchSelect}
                rightElement={
                  <Button
                    variant="unstyled"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    w="32px"
                    h="32px"
                    minW="unset"
                    onClick={() => toast("info", "다음 업데이트에 출시 예정")}
                  >
                    <FavoriteIcon />
                  </Button>
                }
              />
            </Flex>

            {/* 필터 버튼 행 */}
            <Flex w="100%" flexDir="column" align="center">
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
                {/* 별점 필터 버튼 */}
                <Button
                  flexShrink={0}
                  h="32px"
                  px={2.5}
                  borderRadius="20px"
                  bg={isRatingActive ? "gray.900" : "white"}
                  border={isRatingActive ? "none" : "var(--border-main)"}
                  borderColor="gray.300"
                  _hover={{ bg: isRatingActive ? "gray.900" : "gray.100" }}
                  _active={{ opacity: 0.8 }}
                  _focus={{ bg: isRatingActive ? "gray.900" : "white" }}
                  onClick={() => updateQuery({ modal: "ratingFilter" })}
                >
                  <Flex align="center">
                    <Box lineHeight="20px">
                      <StarIcon type="fill" size="lg" />
                    </Box>
                    <Text
                      fontSize="12px"
                      lineHeight="20px"
                      ml={1}
                      mr={1.5}
                      color={isRatingActive ? "white" : "gray.800"}
                    >
                      {ratingButtonLabel}
                    </Text>
                    <ShortArrowIcon dir="bottom" />
                  </Flex>
                </Button>

                {/* 카공 필터 버튼 */}
                <Button
                  flexShrink={0}
                  h="32px"
                  px={3}
                  borderRadius="20px"
                  bg={isAmenityActive ? "gray.900" : "white"}
                  border={isAmenityActive ? "none" : "var(--border-main)"}
                  borderColor="gray.300"
                  _hover={{ bg: isAmenityActive ? "gray.900" : "gray.100" }}
                  _active={{ opacity: 0.8 }}
                  _focus={{ bg: isAmenityActive ? "gray.900" : "white" }}
                  onClick={() => updateQuery({ modal: "amenityFilter" })}
                >
                  <Flex align="center" gap="4px" lineHeight="20px">
                    <Box lineHeight="20px">
                      <AmenityFilterIcon color={isAmenityActive ? "white" : "var(--gray-800)"} />
                    </Box>
                    <Box
                      fontSize="12px"
                      lineHeight="20px"
                      color={isAmenityActive ? "white" : "gray.800"}
                    >
                      카공 필터
                    </Box>
                    {isAmenityActive && (
                      <Flex
                        align="center"
                        justify="center"
                        w="16px"
                        h="16px"
                        borderRadius="full"
                        bg="var(--color-mint)"
                        flexShrink={0}
                      >
                        <Text fontSize="10px" fontWeight={700} color="white" lineHeight="1">
                          {amenityFilters.length}
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                </Button>

                {/* 아카이브 버튼 */}
                {!isMainType && (
                  <Button
                    flexShrink={0}
                    h="32px"
                    px="12px"
                    borderRadius="20px"
                    bg={isArchiveActive ? "gray.900" : "white"}
                    border={isArchiveActive ? "none" : "var(--border-main)"}
                    borderColor="gray.300"
                    _hover={{ bg: isArchiveActive ? "gray.900" : "gray.100" }}
                    _active={{ opacity: 0.8 }}
                    _focus={{ bg: isArchiveActive ? "gray.900" : "white" }}
                    onClick={() => updateQuery({ modal: "archiveFilter" })}
                  >
                    <Flex align="center">
                      <ArchiveIcon color={isArchiveActive ? "white" : "var(--gray-800)"} />
                      <Text
                        fontSize="12px"
                        fontWeight={600}
                        color={isArchiveActive ? "white" : "gray.800"}
                        lineHeight="12px"
                        ml={1}
                        mr={1.5}
                      >
                        {isArchiveActive && activeArchive ? activeArchive.title : "아카이브"}
                      </Text>
                      <ShortArrowIcon dir="bottom" />
                    </Flex>
                  </Button>
                )}
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
          </Flex>
          <Box
            pos="fixed"
            top="calc(var(--header-h) + 40px + 56px + 16px)"
            left={4}
            zIndex={100}
            pointerEvents="auto"
          >
            <StatusButton />
          </Box>
        </>
      )}

      {/* 하단 버튼 행 (확장 시에만) */}
      {isMapExpansion && (
        <Flex
          flexDir="column"
          pos="absolute"
          w="full"
          bottom={0}
          left={0}
          zIndex={300}
          sx={{ paddingBottom: getSafeAreaBottom(16) }}
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

            {!isMainType && (
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
                  <GuideButton pickReviewPlace={pickReviewPlace} />
                </Box>
              </>
            )}
          </Flex>
        </Flex>
      )}

      {/* 아카이브 BottomSheet */}
      {isArchiveOpen && (
        <BottomFlexDrawer
          isDrawerUp
          setIsModal={() => router.back()}
          height={isArchiveActive ? 346 : 373}
          isOverlay
          isHideBottom
          hasTopNav={false}
          zIndex={1100}
        >
          <Flex direction="column" w="full" h="full">
            <Flex justify="center" align="center" py={3} pb={1}>
              <Text fontSize="12px" color="gray.500">
                아카이브
              </Text>
            </Flex>

            <Flex direction="column" w="full" flex={1} overflowY="auto">
              {isArchiveActive && (
                <Flex
                  py={3}
                  align="center"
                  justify="space-between"
                  cursor="pointer"
                  borderBottom="var(--border-main)"
                  onClick={() => {
                    setSelectedPickNickname(null);
                    setFilterType("all");
                    router.back();
                  }}
                >
                  <Text fontSize="13px" color="gray.400">
                    선택 해제
                  </Text>
                  <Text fontSize="16px" color="gray.300" lineHeight="1" mr={0.5}>
                    ×
                  </Text>
                </Flex>
              )}

              {ARCHIVE_OPTIONS.map((archive, idx) => (
                <Flex
                  key={archive.nickname}
                  py={4}
                  borderBottom={idx !== ARCHIVE_OPTIONS.length - 1 ? "var(--border-main)" : "none"}
                  align="center"
                  justify="space-between"
                  cursor="pointer"
                  onClick={() => {
                    setSelectedPickNickname(archive.nickname);
                    setAmenityFilters([]);
                    setFilterType("about");
                    openAboutDrawer();
                    router.back();
                  }}
                >
                  <Flex direction="column" gap={0.5} flex={1} minW={0} mr={3}>
                    <Text fontSize="14px" fontWeight={600} color="gray.800" lineHeight="20px">
                      {archive.title}
                    </Text>
                    <Text fontSize="12px" color="gray.500" lineHeight="18px" noOfLines={1}>
                      {archive.subtitle}
                    </Text>
                  </Flex>
                  <ShortArrowIcon dir="right" />
                </Flex>
              ))}
            </Flex>

            <Box w="full">
              <Button
                w="full"
                py={6}
                borderTop="var(--border-main)"
                borderRadius="0"
                bg="white"
                fontSize="14px"
                fontWeight={600}
                _hover={{ bg: "gray.50" }}
                onClick={() => router.back()}
              >
                닫기
              </Button>
            </Box>
          </Flex>
        </BottomFlexDrawer>
      )}

      {/* 카공 필터 BottomSheet */}
      {isAmenityOpen && (
        <BottomFlexDrawer
          isDrawerUp
          setIsModal={() => router.back()}
          height={391}
          isOverlay
          isHideBottom
          hasTopNav={false}
          zIndex={1100}
        >
          <Flex direction="column" w="full" h="full">
            <Flex justify="center" align="center" pos="relative" py={3} pb={1}>
              <Text fontSize="12px" color="gray.500">
                카공 필터
              </Text>
              {/* {isAmenityActive && (
                <Button
                  variant="unstyled"
                  pos="absolute"
                  right={0}
                  top="50%"
                  transform="translateY(-50%)"
                  display="flex"
                  alignItems="center"
                  gap={1}
                  onClick={() => setAmenityFilters([])}
                >
                  <ResetIcon />
                  <Text fontSize="12px" color="gray.400">
                    초기화
                  </Text>
                </Button>
              )} */}
            </Flex>

            <Flex direction="column" w="full">
              {AMENITY_OPTIONS.map((option) => {
                const isChecked = amenityFilters.includes(option.value);
                return (
                  <Flex
                    h="60px"
                    key={option.value}
                    align="center"
                    justify="space-between"
                    cursor="pointer"
                    onClick={() => toggleAmenity(option.value)}
                  >
                    <Text fontSize="14px" fontWeight={isChecked ? 700 : 500} color="black">
                      {option.label}
                    </Text>
                    <CheckIcon2 isSelected={isChecked} />
                  </Flex>
                );
              })}
            </Flex>

            <Box mt="auto" w="full">
              <Button
                w="full"
                py={6}
                borderTop="var(--border-main)"
                borderRadius="0"
                bg="white"
                fontSize="14px"
                fontWeight={600}
                _hover={{ bg: "gray.50" }}
                onClick={() => router.back()}
              >
                완료
              </Button>
            </Box>
          </Flex>
        </BottomFlexDrawer>
      )}

      {/* 별점 필터 BottomSheet */}
      {isFilterOpen && (
        <BottomFlexDrawer
          isDrawerUp
          setIsModal={() => router.back()}
          height={331}
          isOverlay
          isHideBottom
          hasTopNav={false}
          zIndex={1100}
        >
          <Flex direction="column" w="full" h="full">
            <Flex justify="center" align="center" py={3} pb={1}>
              <Text fontSize="12px" color="gray.500">
                별점
              </Text>
            </Flex>

            <Flex direction="column" w="full">
              {RATING_OPTIONS.map((option) => {
                const isSelected =
                  filterType === option.filterType ||
                  (option.value === "all" &&
                    !RATING_OPTIONS.slice(1).some((o) => o.filterType === filterType));
                return (
                  <Flex
                    h="60px"
                    key={option.value}
                    align="center"
                    justify="space-between"
                    cursor="pointer"
                    onClick={() => {
                      setFilterType(option.filterType);
                      setAmenityFilters([]);
                      router.back();
                    }}
                  >
                    <Text fontSize="14px" fontWeight={isSelected ? 700 : 500} color="black">
                      {option.label}
                    </Text>
                    {isSelected && <CheckIcon2 isSelected />}
                  </Flex>
                );
              })}
            </Flex>

            <Box mt="auto" w="full">
              <Button
                w="full"
                py={6}
                borderTop="var(--border-main)"
                borderRadius="0"
                bg="white"
                fontSize="14px"
                fontWeight={600}
                _hover={{ bg: "gray.50" }}
                onClick={() => router.back()}
              >
                닫기
              </Button>
            </Box>
          </Flex>
        </BottomFlexDrawer>
      )}
    </>
  );
}

export default StudyMapNav;

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

function FavoriteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="var(--gray-500)"
    >
      <path d="M451.5-152q-14.5-5-25.5-16l-69-63q-106-97-191.5-192.5T80-634q0-94 63-157t157-63q53 0 100 22.5t80 61.5q33-39 80-61.5T660-854q94 0 157 63t63 157q0 115-85 211T602-230l-68 62q-11 11-25.5 16t-28.5 5q-14 0-28.5-5ZM442-690q-29-41-62-62.5T300-774q-60 0-100 40t-40 100q0 52 37 110.5T285.5-410q51.5 55 106 103t88.5 79q34-31 88.5-79t106-103Q726-465 763-523.5T800-634q0-60-40-100t-100-40q-47 0-80 21.5T518-690q-7 10-17 15t-21 5q-11 0-21-5t-17-15Zm38 189Z" />
    </svg>
  );
}

function ArchiveIcon({ color }: { color?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="14px"
      viewBox="0 -960 960 960"
      width="14px"
      fill={color}
    >
      <path d="M200-120q-17 0-28.5-11.5T160-160q0-17 11.5-28.5T200-200h560q17 0 28.5 11.5T800-160q0 17-11.5 28.5T760-120H200Zm120-160q-66 0-113-47t-47-113v-320q0-33 23.5-56.5T240-840h560q33 0 56.5 23.5T880-760v120q0 33-23.5 56.5T800-560h-80v120q0 66-47 113t-113 47H320Zm400-360h80v-120h-80v120Z" />
    </svg>
  );
}

function AmenityFilterIcon({ color }: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="14px"
      viewBox="0 -960 960 960"
      width="14px"
      fill={color}
    >
      <path d="M451.5-131.5Q440-143 440-160v-160q0-17 11.5-28.5T480-360q17 0 28.5 11.5T520-320v40h280q17 0 28.5 11.5T840-240q0 17-11.5 28.5T800-200H520v40q0 17-11.5 28.5T480-120q-17 0-28.5-11.5ZM160-200q-17 0-28.5-11.5T120-240q0-17 11.5-28.5T160-280h160q17 0 28.5 11.5T360-240q0 17-11.5 28.5T320-200H160Zm131.5-171.5Q280-383 280-400v-40H160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h120v-40q0-17 11.5-28.5T320-600q17 0 28.5 11.5T360-560v160q0 17-11.5 28.5T320-360q-17 0-28.5-11.5ZM480-440q-17 0-28.5-11.5T440-480q0-17 11.5-28.5T480-520h320q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H480Zm131.5-171.5Q600-623 600-640v-160q0-17 11.5-28.5T640-840q17 0 28.5 11.5T680-800v40h120q17 0 28.5 11.5T840-720q0 17-11.5 28.5T800-680H680v40q0 17-11.5 28.5T640-600q-17 0-28.5-11.5ZM160-680q-17 0-28.5-11.5T120-720q0-17 11.5-28.5T160-760h320q17 0 28.5 11.5T520-720q0 17-11.5 28.5T480-680H160Z" />
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

function MenuIcon2() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="28px"
      viewBox="0 -960 960 960"
      width="28px"
      fill="var(--color-gray)"
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

function CheckIcon2({ isSelected }: { isSelected: boolean }) {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill={isSelected ? "var(--gray-900)" : "var(--gray-300)"}
  >
    <path d="m382-354 339-339q12-12 28-12t28 12q12 12 12 28.5T777-636L410-268q-12 12-28 12t-28-12L182-440q-12-12-11.5-28.5T183-497q12-12 28.5-12t28.5 12l142 143Z" />
  </svg>
}
