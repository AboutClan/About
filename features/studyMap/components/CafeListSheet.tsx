import { Box, Flex, Menu, MenuButton, MenuItem, MenuList, Portal } from "@chakra-ui/react";
import dayjs from "dayjs";
import { animate, motion, useMotionValue } from "framer-motion";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import DrawerHandle from "@/components/atoms/DrawerHandle";
import { CAFE_MAP_LOGO_DEFAULT, getCafeMapLogo } from "@/features/study/lib/getStudyVoteIcon";
import { getPlaceScore } from "@/features/study/lib/studyUtils";
import { getOpenStatus } from "@/features/studyMap/components/CafeListDrawer";
import useSheetBodyDrag from "@/hooks/custom/useSheetBodyDrag";
import { StudyPlaceProps } from "@/types/models/studyTypes/study-entity.types";
import { getDistanceFromLatLonInKm } from "@/utils/mathUtils";
import { getSafeAreaBottom } from "@/utils/validationUtils";

export type CafeListSheetSnap = "peek" | "half" | "full";

// 시트가 가장 낮을 때 보이는 높이. 지도 위 버튼 줄을 이만큼 올려 두기 위해 export.
export const CAFE_LIST_SHEET_PEEK = 142;
const BOTTOM_NAV_HEIGHT = 52;
const FULL_TOP_GAP = 48;
const HALF_RATIO = 0.45;
// 이 속도(px/ms) 이상으로 튕기면 거리와 관계없이 그 방향의 다음 단계로 스냅
const FLICK_VELOCITY = 0.5;
/** 목록을 한 번에 이만큼만 그린다 (줌아웃 시 전 데이터가 들어오는 것 방지) */
const ROWS_PAGE_SIZE = 60;
// 이 거리(px) 이하로 움직이고 떼면 드래그가 아닌 탭으로 본다
const TAP_SLOP = 6;

type SortType = "distance" | "rating" | "review";
const SORT_LABEL: Record<SortType, string> = {
  distance: "거리순",
  rating: "평점순",
  review: "리뷰 많은순",
};

interface CafeListSheetProps {
  places: StudyPlaceProps[];
  // 거리 계산·거리순 정렬 기준점 (내 위치, 없으면 지도 중심)
  refPoint: { lat: number; lon: number } | null;
  snap: CafeListSheetSnap;
  onSnapChange: (snap: CafeListSheetSnap) => void;
  onPlaceClick: (place: StudyPlaceProps) => void;
  // 클러스터 선택·PICK 필터처럼 목록 범위가 좁혀졌을 때의 칩 문구. 없으면 "전체"
  scopeLabel?: string;
  onClearScope?: () => void;
}

const formatDistance = (km: number) => {
  if (!Number.isFinite(km)) return "";
  if (km < 1) return `${Math.max(10, Math.round((km * 1000) / 10) * 10)}m`;
  return `${km.toFixed(1)}km`;
};

export default function CafeListSheet({
  places,
  refPoint,
  snap,
  onSnapChange,
  onPlaceClick,
  scopeLabel,
  onClearScope,
}: CafeListSheetProps) {
  const [viewportHeight, setViewportHeight] = useState(0);
  const [sort, setSort] = useState<SortType>("distance");

  useEffect(() => {
    const update = () => setViewportHeight(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const fullHeight = Math.max(
    CAFE_LIST_SHEET_PEEK,
    viewportHeight - BOTTOM_NAV_HEIGHT - FULL_TOP_GAP,
  );
  const halfHeight = Math.max(CAFE_LIST_SHEET_PEEK, Math.round(viewportHeight * HALF_RATIO));

  // 박스 높이는 full 로 고정하고 translateY 로 노출량만 조절한다 (BottomFlexDrawer 와 같은 방식).
  const snapOffsets = useMemo<Record<CafeListSheetSnap, number>>(
    () => ({
      peek: fullHeight - CAFE_LIST_SHEET_PEEK,
      half: fullHeight - halfHeight,
      full: 0,
    }),
    [fullHeight, halfHeight],
  );

  const y = useMotionValue(snapOffsets.peek);

  // 화면 높이를 처음 알게 된 순간에는 애니메이션 없이 바로 제자리에 둔다
  // (첫 렌더의 y 는 높이를 모르는 상태의 값이라, 애니메이션하면 크게 떴다가 줄어드는 게 보인다).
  const isPlacedRef = useRef(false);

  useEffect(() => {
    if (!viewportHeight) return;
    if (!isPlacedRef.current) {
      isPlacedRef.current = true;
      y.set(snapOffsets[snap]);
      return;
    }
    const controls = animate(y, snapOffsets[snap], {
      type: "tween",
      ease: "easeOut",
      duration: 0.25,
    });
    return () => controls.stop();
  }, [snap, snapOffsets, viewportHeight, y]);

  const dragRef = useRef<{
    startY: number;
    startOffset: number;
    lastY: number;
    lastT: number;
    moved: boolean;
  }>();
  // 드래그 직후 따라오는 click 이 "탭해서 열기"로 처리되지 않게 막는다.
  const justDraggedRef = useRef(false);

  const onMoveRef = useRef<(clientY: number, timeStamp: number) => void>();
  const onUpRef = useRef<(clientY: number, timeStamp: number) => void>();
  const onCancelRef = useRef<() => void>();

  const stableMove = useCallback(
    (event: PointerEvent) => onMoveRef.current?.(event.clientY, event.timeStamp),
    [],
  );
  const stableUp = useCallback(
    (event: PointerEvent) => onUpRef.current?.(event.clientY, event.timeStamp),
    [],
  );
  const stableCancel = useCallback(() => onCancelRef.current?.(), []);

  const detachDragListeners = useCallback(() => {
    window.removeEventListener("pointermove", stableMove);
    window.removeEventListener("pointerup", stableUp);
    window.removeEventListener("pointercancel", stableCancel);
  }, [stableMove, stableUp, stableCancel]);

  // 핸들(pointer)과 목록 스와이프(touch) 두 입력 경로가 이 엔진을 공유한다. 그래서 목록에서
  // 시작한 스와이프도 핸들 드래그와 완전히 같은 규칙(속도 + 최근접 스냅)으로 끝난다.
  const handlePointerMove = useCallback(
    (clientY: number, timeStamp: number) => {
      const drag = dragRef.current;
      if (!drag) return;
      if (Math.abs(clientY - drag.startY) > TAP_SLOP) drag.moved = true;
      const next = drag.startOffset + (clientY - drag.startY);
      y.set(Math.min(snapOffsets.peek, Math.max(0, next)));
      drag.lastY = clientY;
      drag.lastT = timeStamp;
    },
    [snapOffsets, y],
  );

  const handlePointerUp = useCallback(
    (clientY: number, timeStamp: number) => {
      const drag = dragRef.current;
      detachDragListeners();
      if (!drag) return;
      dragRef.current = undefined;

      // 거의 안 움직였으면 탭 — 닫힌 시트는 onClickCapture 가 절반으로 올린다.
      if (!drag.moved) return;
      justDraggedRef.current = true;
      setTimeout(() => {
        justDraggedRef.current = false;
      }, 0);

      const dt = Math.max(1, timeStamp - drag.lastT);
      const velocity = (clientY - drag.lastY) / dt; // +: 아래로
      const current = y.get();
      const order: CafeListSheetSnap[] = ["full", "half", "peek"];

      let target: CafeListSheetSnap;
      if (Math.abs(velocity) > FLICK_VELOCITY) {
        // 튕긴 방향으로 현재 위치에서 가장 가까운 다음 단계
        const candidates = order.filter((s) =>
          velocity > 0 ? snapOffsets[s] > current : snapOffsets[s] < current,
        );
        target = candidates.length
          ? candidates.reduce((a, b) =>
              Math.abs(snapOffsets[a] - current) < Math.abs(snapOffsets[b] - current) ? a : b,
            )
          : velocity > 0
            ? "peek"
            : "full";
      } else {
        target = order.reduce((a, b) =>
          Math.abs(snapOffsets[a] - current) < Math.abs(snapOffsets[b] - current) ? a : b,
        );
      }

      // 같은 단계로 돌아오는 경우에도 제자리로 애니메이션해야 하므로 직접 animate 한다.
      animate(y, snapOffsets[target], { type: "tween", ease: "easeOut", duration: 0.2 });
      if (target !== snap) onSnapChange(target);
    },
    [detachDragListeners, onSnapChange, snap, snapOffsets, y],
  );

  // 브라우저/웹뷰가 제스처를 가져가면 pointerup 대신 pointercancel 이 온다. 이걸 받지 않으면
  // dragRef 와 window 의 pointermove 가 남아, 이후 지도 위 드래그가 시트를 따라오게 만든다.
  const handlePointerCancel = useCallback(() => {
    const drag = dragRef.current;
    detachDragListeners();
    if (!drag) return;
    dragRef.current = undefined;
    animate(y, snapOffsets[snap], { type: "tween", ease: "easeOut", duration: 0.2 });
  }, [detachDragListeners, snap, snapOffsets, y]);

  const handlePointerDown = (event: React.PointerEvent) => {
    // 드롭다운·칩 버튼을 누를 때는 드래그로 가로채지 않는다.
    if ((event.target as HTMLElement).closest("button")) return;
    dragRef.current = {
      startY: event.clientY,
      startOffset: y.get(),
      lastY: event.clientY,
      lastT: event.timeStamp,
      moved: false,
    };
    window.addEventListener("pointermove", stableMove);
    window.addEventListener("pointerup", stableUp);
    window.addEventListener("pointercancel", stableCancel);
  };

  // 드래그 중 리렌더(resize 로 snapOffsets 변경 등)가 일어나도 등록·해제 대상이 어긋나지
  // 않도록, window 에는 identity 가 고정된 wrapper 만 붙인다.
  onMoveRef.current = handlePointerMove;
  onUpRef.current = handlePointerUp;
  onCancelRef.current = handlePointerCancel;

  useEffect(() => detachDragListeners, [detachDragListeners]);

  // 목록 본문에서 시작한 스와이프. 판정(스크롤이냐 시트냐)은 훅이 하고, 확정되면 위 엔진을
  // 그대로 태운다. moved: true 로 시작하는 이유 — 훅이 이미 슬롭을 넘겨 드래그로 확정한
  // 뒤에 부르므로, handlePointerUp 의 "탭이면 무시" 분기를 타면 안 된다.
  const beginBodyDrag = useCallback(
    (clientY: number, timeStamp: number) => {
      dragRef.current = {
        startY: clientY,
        startOffset: y.get(),
        lastY: clientY,
        lastT: timeStamp,
        moved: true,
      };
    },
    [y],
  );

  const listDragRef = useSheetBodyDrag({
    // full 이면 더 올라갈 곳이 없으니 목록 스크롤에 양보한다.
    canDragUp: () => y.get() > 0,
    canDragDown: () => y.get() < snapOffsets.peek,
    onDragStart: beginBodyDrag,
    onDragMove: handlePointerMove,
    onDragEnd: handlePointerUp,
    onDragCancel: handlePointerCancel,
  });

  const rows = useMemo(() => {
    const withMeta = places.map((place) => {
      const ratingCount = place.ratings?.length ?? 0;
      return {
        place,
        distanceKm: refPoint
          ? getDistanceFromLatLonInKm(
              refPoint.lat,
              refPoint.lon,
              place.location.latitude,
              place.location.longitude,
            )
          : NaN,
        rating: ratingCount ? getPlaceScore(place.ratings).total : null,
        ratingCount,
      };
    });
    const byDistance = (a: (typeof withMeta)[number], b: (typeof withMeta)[number]) =>
      (Number.isFinite(a.distanceKm) ? a.distanceKm : Infinity) -
      (Number.isFinite(b.distanceKm) ? b.distanceKm : Infinity);

    return withMeta.sort((a, b) => {
      if (sort === "rating") return (b.rating ?? -1) - (a.rating ?? -1) || byDistance(a, b);
      if (sort === "review") return b.ratingCount - a.ratingCount || byDistance(a, b);
      return byDistance(a, b);
    });
  }, [places, refPoint, sort]);

  // 행 클릭 콜백은 부모에서 매 렌더 새로 만들어진다(shallow router push 의존).
  // memo 된 행이 그것 때문에 전부 리렌더되지 않게 ref 로 우회한다.
  const onPlaceClickRef = useRef(onPlaceClick);
  onPlaceClickRef.current = onPlaceClick;
  const handleRowClick = useCallback((place: StudyPlaceProps) => {
    onPlaceClickRef.current(place);
  }, []);

  // 행마다 dayjs 객체를 만들지 않도록 "지금"을 한 번만 구한다.
  // 분 단위로만 갱신하면 영업중/종료 표시가 늦지 않으면서 렌더 비용도 거의 없다.
  const [minuteTick, setMinuteTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setMinuteTick((t) => t + 1), 60_000);
    return () => clearInterval(timer);
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const nowHHmm = useMemo(() => dayjs().format("HH:mm"), [minuteTick]);

  // 줌아웃하면 viewportRadiusKm 이 최대 1000km 까지 벌어져 전 데이터가 목록에 들어온다.
  // 한 번에 다 그리면 스크롤이 죽으므로 페이지 단위로 늘린다.
  const [visibleCount, setVisibleCount] = useState(ROWS_PAGE_SIZE);
  useEffect(() => {
    setVisibleCount(ROWS_PAGE_SIZE);
  }, [rows]);
  const visibleRows = rows.slice(0, visibleCount);

  if (!viewportHeight) return null;

  return (
    // 바깥 박스는 하단 탭 위 영역만큼만 차지하고 넘치는 부분을 잘라, 아래로 밀린 시트가
    // 하단 탭을 덮지 않게 한다. 빈 영역은 터치를 지도로 통과시킨다.
    <Box
      pos="fixed"
      left={0}
      right={0}
      mx="auto"
      bottom={getSafeAreaBottom(BOTTOM_NAV_HEIGHT)}
      w="full"
      maxW="var(--max-width)"
      h={`${fullHeight}px`}
      overflow="hidden"
      pointerEvents="none"
      zIndex={1000}
    >
      <Box
        as={motion.div}
        style={{ y }}
        pointerEvents="auto"
        w="full"
        h={`${fullHeight}px`}
        bg="white"
        borderTopRadius="20px"
        boxShadow="0 -4px 16px rgba(0,0,0,0.08)"
        display="flex"
        flexDir="column"
        overflow="hidden"
        willChange="transform"
        onClickCapture={(event) => {
          if (justDraggedRef.current) {
            event.stopPropagation();
            event.preventDefault();
            return;
          }
          // 닫혀 있을 때는 어디를 눌러도 먼저 절반까지 연다 (행·정렬 버튼 동작은 막음)
          if (snap === "peek") {
            event.stopPropagation();
            event.preventDefault();
            onSnapChange("half");
          }
        }}
      >
        {/* 드래그 영역: 핸들 + 헤더 줄 */}
        <Box
          flexShrink={0}
          cursor="grab"
          onPointerDown={handlePointerDown}
          userSelect="none"
          sx={{ touchAction: "none" }}
        >
          <DrawerHandle />
          <Flex align="center" gap={2} px={4} pb={3}>
            <Menu placement="bottom-start">
              <MenuButton
                as="button"
                type="button"
                style={{
                  height: "32px",
                  padding: "0 12px",
                  borderRadius: "16px",
                  border: "1px solid var(--gray-300)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--gray-800)",
                  background: "white",
                  outline: "none",
                  boxShadow: "none",
                }}
              >
                {SORT_LABEL[sort]} ▾
              </MenuButton>
              <Portal>
                <MenuList zIndex={2000} minW="120px" fontSize="13px">
                  {(Object.keys(SORT_LABEL) as SortType[]).map((key) => (
                    <MenuItem
                      key={key}
                      fontWeight={key === sort ? 700 : 400}
                      color={key === sort ? "var(--color-mint)" : undefined}
                      onClick={() => setSort(key)}
                    >
                      {SORT_LABEL[key]}
                    </MenuItem>
                  ))}
                </MenuList>
              </Portal>
            </Menu>
            <Box w="1px" h="16px" bg="gray.200" />
            <Flex
              as="button"
              type="button"
              cursor={onClearScope ? "pointer" : "default"}
              align="center"
              gap={1}
              h="32px"
              px={3}
              borderRadius="16px"
              bg="rgba(0, 194, 179, 0.1)"
              color="var(--color-mint)"
              fontSize="13px"
              fontWeight={700}
              minW={0}
              onClick={onClearScope}
            >
              <Box as="span" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                {scopeLabel ?? "전체"} {rows.length}
              </Box>
              {onClearScope && (
                <Box as="span" fontSize="14px" lineHeight={1} ml="2px">
                  ✕
                </Box>
              )}
            </Flex>
          </Flex>
        </Box>

        {/* 목록: peek 에서는 스크롤을 잠가 드래그와 충돌하지 않게 한다.
            (스크롤 영역이 아예 없으니 위로 미는 순간 훅이 곧바로 시트 드래그로 확정한다) */}
        <Box
          ref={listDragRef}
          flex={1}
          minH={0}
          overflowY={snap === "peek" ? "hidden" : "auto"}
          borderTop="var(--border-main)"
          px={4}
          pb={4}
          sx={{
            "::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {rows.length ? (
            <>
              {visibleRows.map(({ place, distanceKm, rating }) => (
                <CafeSheetRow
                  key={place._id}
                  place={place}
                  distanceKm={distanceKm}
                  rating={rating}
                  now={nowHHmm}
                  onSelect={handleRowClick}
                />
              ))}
              {rows.length > visibleCount && (
                <Box
                  as="button"
                  type="button"
                  w="full"
                  py={3}
                  fontSize="13px"
                  fontWeight={600}
                  color="gray.600"
                  onClick={() => setVisibleCount((prev) => prev + ROWS_PAGE_SIZE)}
                >
                  더 보기 ({rows.length - visibleCount})
                </Box>
              )}
            </>
          ) : (
            <Box py={8} textAlign="center" fontSize="13px" color="gray.500">
              이 지역에 조건에 맞는 카공 카페가 없어요
            </Box>
          )}
          {/* 화면 밖으로 잘린 만큼의 여백.
              시트 박스는 항상 full 높이이고 translateY 로만 노출량을 줄이기 때문에, 중간
              단계에서는 목록 요소의 아래쪽 snapOffsets[snap] px 가 화면 밖에 있다. 이 여백이
              없으면 끝까지 스크롤해도 마지막 항목들이 그 영역에 갇혀 영영 보이지 않는다.
              (padding 은 브라우저에 따라 scrollHeight 에 안 잡히는 경우가 있어 요소로 둔다.) */}
          <Box h={`${snapOffsets[snap]}px`} aria-hidden />
        </Box>
      </Box>
      {/* 하단 탭과의 경계. 하단 탭의 테두리·그림자는 시트 뒤에 가려지므로 여기서 그린다. */}
      <Box
        pos="absolute"
        left={0}
        right={0}
        bottom={0}
        h="1px"
        bg="gray.200"
        boxShadow="0 -2px 8px rgba(0,0,0,0.08)"
      />
    </Box>
  );
}

const CAFE_ROW_LOGO = getCafeMapLogo(22, CAFE_MAP_LOGO_DEFAULT);

const CafeSheetRow = memo(function CafeSheetRow({
  place,
  distanceKm,
  rating,
  now,
  onSelect,
}: {
  place: StudyPlaceProps;
  distanceKm: number;
  rating: number | null;
  /** 부모가 한 번 계산한 "HH:mm". 행마다 dayjs 를 만들지 않기 위해 내려받는다. */
  now: string;
  onSelect: (place: StudyPlaceProps) => void;
}) {
  const { isOpen } = getOpenStatus(place, now);
  const distance = formatDistance(distanceKm);

  const meta: React.ReactNode[] = [];
  if (rating !== null) {
    meta.push(
      <Box as="span" key="rating" color="gray.800" fontWeight={600}>
        <Box as="span" color="#FFA800">
          ★
        </Box>
        {rating.toFixed(1)}
      </Box>,
    );
  }
  if (isOpen !== null) {
    meta.push(
      <Box as="span" key="open" color={isOpen ? "green.500" : "gray.400"} fontWeight={600}>
        {isOpen ? "영업중" : "영업 종료"}
      </Box>,
    );
  }
  if (distance) meta.push(<span key="distance">{distance}</span>);

  return (
    <Flex
      as="button"
      type="button"
      w="full"
      align="center"
      gap={3}
      py="14px"
      borderBottom="var(--border-main)"
      textAlign="left"
      _active={{ opacity: 0.7 }}
      onClick={() => onSelect(place)}
    >
      <Flex
        flexShrink={0}
        w="44px"
        h="44px"
        borderRadius="full"
        bg="rgba(0, 194, 179, 0.1)"
        align="center"
        justify="center"
        dangerouslySetInnerHTML={{ __html: CAFE_ROW_LOGO }}
      />
      <Flex direction="column" flex={1} minW={0} gap="2px">
        <Box
          fontSize="15px"
          fontWeight={700}
          color="gray.900"
          lineHeight="22px"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {place.location.name}
        </Box>
        {meta.length > 0 && (
          <Flex fontSize="12px" color="gray.500" lineHeight="18px" align="center" wrap="wrap">
            {meta.map((item, idx) => (
              <Flex as="span" key={idx} align="center">
                {idx > 0 && (
                  <Box as="span" mx="6px" color="gray.300">
                    ·
                  </Box>
                )}
                {item}
              </Flex>
            ))}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
});
