import { Box, Button, Flex } from "@chakra-ui/react";
import { animate, motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import DrawerHandle from "@/components/atoms/DrawerHandle";
import ScreenOverlay from "@/components/atoms/ScreenOverlay";
import { IModal } from "@/types/components/modalTypes";
import { getSafeAreaBottom } from "@/utils/validationUtils";

export const DRAWER_MIN_HEIGHT = 103;
//적당한 값 조율해야 함
export const MAX_DRAG_DISTANCE = 40;

const SWIPE_THRESHOLD = 40; // 스와이프 임계값
/** 이 높이를 넘을 때만 본문·푸터를 렌더한다 */
const BODY_VISIBLE_HEIGHT = 100;

/** PointerEvent 우선, 일부 웹뷰가 넘기는 touches 폴백까지 읽는다 */
const readClientY = (event: PointerEvent | TouchEvent): number | undefined =>
  (event as PointerEvent).clientY ?? (event as TouchEvent).touches?.[0]?.clientY;

export interface BottomFlexDrawerOptions {
  header?: {
    title: string;
    subTitle?: string;
  };
  footer?: {
    text: string;
    func: () => void;
    loading?: boolean;
  };
}

interface BottomFlexDrawerProps extends IModal {
  isHideBottom?: boolean;
  headerSlot?: React.ReactNode;
  children: React.ReactNode;
  isDrawerUp: boolean;
  height: number;
  zIndex?: number;
  drawerOptions?: BottomFlexDrawerOptions;
  isOverlay: boolean;
  hasTopNav?: boolean;
}

export default function BottomFlexDrawer({
  setIsModal,
  isHideBottom,
  headerSlot,
  drawerOptions,
  children,
  isDrawerUp,
  height: maxHeight,
  zIndex,
  isOverlay,
  hasTopNav = true,
}: BottomFlexDrawerProps) {
  // 드래그 중 높이는 ref 로만 들고, 리렌더가 필요한 "본문을 보일지"만 state 로 둔다.
  // (예전에는 pointermove 마다 setDrawerHeight 가 돌아서 드로어와 그 자식 — PlaceInfoDrawer
  //  본문, CafeListDrawer 의 비가상화 리스트 — 전체가 프레임마다 리렌더됐다.)
  const heightRef = useRef(isDrawerUp ? maxHeight : DRAWER_MIN_HEIGHT);
  const [isBodyVisible, setIsBodyVisible] = useState(
    (isDrawerUp ? maxHeight : DRAWER_MIN_HEIGHT) > BODY_VISIBLE_HEIGHT,
  );
  const startYRef = useRef(0); // 드래그 시작 위치 저장
  const currentHeightRef = useRef(heightRef.current); // 드래그 시작 시점의 높이

  const applyHeight = useCallback((next: number) => {
    heightRef.current = next;
    setIsBodyVisible(next > BODY_VISIBLE_HEIGHT);
  }, []);

  // open animation 의 target. props 에만 의존 → 드래그가 일어나도 변하지 않음.
  const openTargetY = isDrawerUp ? 0 : maxHeight - DRAWER_MIN_HEIGHT;

  // transform 의 단일 source. 첫 paint 는 peeking(103px) 위치에서 시작.
  const y = useMotionValue(maxHeight - DRAWER_MIN_HEIGHT);

  // 마운트(또는 isDrawerUp/maxHeight 변경)될 때만 imperative animate 한 번.
  // 부모 rerender, 드래그가 일어나도 이 effect 는 다시 트리거되지 않음.
  useEffect(() => {
    const controls = animate(y, openTargetY, {
      type: "tween",
      ease: "easeOut",
      duration: 0.28,
    });
    return () => controls.stop();
  }, [openTargetY, y]);

  useEffect(() => {
    applyHeight(isDrawerUp ? maxHeight : DRAWER_MIN_HEIGHT);
  }, [isDrawerUp, maxHeight, applyHeight]);

  // 드래그 중인지. pointercancel / 언마운트 정리 경로에서 함께 본다.
  const isDraggingRef = useRef(false);

  // window 에 등록하는 리스너는 identity 가 고정돼야 remove 가 성립한다.
  // 실제 로직은 매 렌더 갱신되는 ref 를 통해 읽는다.
  const onMoveRef = useRef<(event: PointerEvent) => void>();
  const onUpRef = useRef<(event: PointerEvent) => void>();
  const onCancelRef = useRef<() => void>();

  const stableMove = useCallback((event: PointerEvent) => onMoveRef.current?.(event), []);
  const stableUp = useCallback((event: PointerEvent) => onUpRef.current?.(event), []);
  const stableCancel = useCallback(() => onCancelRef.current?.(), []);

  const detachDragListeners = useCallback(() => {
    window.removeEventListener("pointermove", stableMove);
    window.removeEventListener("pointerup", stableUp);
    window.removeEventListener("pointercancel", stableCancel);
    isDraggingRef.current = false;
  }, [stableMove, stableUp, stableCancel]);

  const settleTo = useCallback(
    (height: number) => {
      applyHeight(height);
      animate(y, maxHeight - height, { type: "tween", ease: "easeOut", duration: 0.2 });
    },
    [applyHeight, maxHeight, y],
  );

  onMoveRef.current = (event) => {
    if (!isDraggingRef.current) return;
    const clientY = readClientY(event);
    if (clientY == null) return;
    const deltaY = startYRef.current - clientY;

    // 드래그 범위는 최소/최대 높이 기준으로 제한한다.
    const newHeight = Math.max(DRAWER_MIN_HEIGHT, Math.min(currentHeightRef.current + deltaY, maxHeight));

    applyHeight(newHeight);
    // 드래그는 transform 을 즉시 직접 갱신. open animation 과 독립적으로 동작.
    y.set(maxHeight - newHeight);
  };

  onUpRef.current = (event) => {
    if (!isDraggingRef.current) return;
    const clientY = readClientY(event);
    const deltaY = clientY == null ? 0 : startYRef.current - clientY;

    detachDragListeners();

    // 위로 잘 올렸으면 풀오픈
    if (deltaY > SWIPE_THRESHOLD) {
      settleTo(maxHeight);
      return;
    }

    // 아래로 충분히 내렸으면 닫기
    if (deltaY < -SWIPE_THRESHOLD) {
      setIsModal(false); // ← 진짜 닫는 건 여기서만
      applyHeight(DRAWER_MIN_HEIGHT);
      return;
    }

    // 애매하면 원래 위치로 복원
    settleTo(currentHeightRef.current);
  };

  // 브라우저/웹뷰가 제스처를 가져가면 pointerup 대신 pointercancel 이 온다.
  // 이걸 받지 않으면 window 의 pointermove 가 붙은 채 남아, 이후 지도 위 드래그가
  // 드로어 높이를 움직인다("지도가 안 움직이고 시트만 따라옴").
  onCancelRef.current = () => {
    if (!isDraggingRef.current) return;
    detachDragListeners();
    settleTo(currentHeightRef.current);
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    // 🔥 여기는 모달을 "닫으면 안 됨"
    const clientY = readClientY(event.nativeEvent);
    if (clientY == null) return;
    startYRef.current = clientY;
    currentHeightRef.current = heightRef.current;
    isDraggingRef.current = true;

    window.addEventListener("pointermove", stableMove);
    window.addEventListener("pointerup", stableUp);
    window.addEventListener("pointercancel", stableCancel);
  };

  // 드래그 중 언마운트되어도(예: 딤 탭·router.back) window 리스너가 남지 않게 한다.
  useEffect(() => detachDragListeners, [detachDragListeners]);

  return (
    <>
      {isOverlay && <ScreenOverlay zIndex={zIndex} onClick={() => setIsModal(false)} />}
      <Layout
        ishide={isHideBottom ? "true" : "false"}
        zindex={zIndex}
        isdrawerup={isDrawerUp ? "true" : "false"}
        maxheight={maxHeight}
        as={motion.div}
        style={{ y }}
      >
        {hasTopNav && (
          <DrawerHandle
            cursor="grab"
            onPointerDown={handlePointerDown}
            userSelect="none"
            sx={{ touchAction: "none" }}
          />
        )}
        {drawerOptions?.header && (
          <Flex mb={4} w="full" direction="column" align="flex-start">
            <Box lineHeight="28px" fontWeight={800} mb={1} fontSize="18px">
              {drawerOptions?.header.title}
            </Box>
            <Box fontSize="12px" color="gray.500">
              {drawerOptions?.header.subTitle}
            </Box>
          </Flex>
        )}
        {headerSlot && (
          <Box
            w="full"
            cursor="grab"
            onPointerDown={handlePointerDown}
            userSelect="none"
            sx={{ touchAction: "none" }}
          >
            {headerSlot}
          </Box>
        )}
        <Flex
          direction="column"
          flex={1}
          minH={0}
          w="100%"
          sx={{ touchAction: "pan-y" }}
          align="center"
        >
          {isBodyVisible && children}
        </Flex>
        {drawerOptions?.footer && isBodyVisible && (
          <Box py={2} w="100%" mt="auto" mb={getSafeAreaBottom(0)}>
            <Button
              w="100%"
              mt="auto"
              colorScheme="mint"
              size="lg"
              isLoading={drawerOptions?.footer?.loading}
              onClick={drawerOptions?.footer?.func}
            >
              {drawerOptions?.footer?.text}
            </Button>
          </Box>
        )}
      </Layout>
    </>
  );
}

const Layout = styled.div<{
  ishide: string;
  zindex: number;
  isdrawerup: string;
  maxheight: number;
}>`
  position: fixed;
  left: 0;
  right: 0;
  margin: 0 auto;
  overflow: hidden;
  bottom: ${(props) => (props.ishide === "true" ? 0 : 52)}px;
  width: 100%;
  max-width: var(--max-width);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;

  background-color: white;
  z-index: ${(props) => props.zindex || (props.ishide === "true" ? 700 : 500)};
  padding: 0 20px;
  padding-bottom: ${(props) =>
    props.isdrawerup === "false" ? getSafeAreaBottom(12) : getSafeAreaBottom(0)};
  padding-top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 박스 자체는 maxHeight로 고정. 보이는 양은 transform: translateY 로만 조절해
     매 프레임 layout reflow 없이 compositor만 사용하게 한다. */
  height: ${(props) => props.maxheight}px;
  will-change: transform;
`;
