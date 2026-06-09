import { Box, Button, Flex } from "@chakra-ui/react";
import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { IModal } from "../../../types/components/modalTypes";
import { getSafeAreaBottom } from "../../../utils/validationUtils";
import ScreenOverlay from "../../atoms/ScreenOverlay";

export const DRAWER_MIN_HEIGHT = 103;
//적당한 값 조율해야 함
export const MAX_DRAG_DISTANCE = 40;

const SWIPE_THRESHOLD = 40; // 스와이프 임계값

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
  const [drawerHeight, setDrawerHeight] = useState(isDrawerUp ? maxHeight : DRAWER_MIN_HEIGHT); // 닫힘/드래그 판단용
  const startYRef = useRef(0); // 드래그 시작 위치 저장
  const currentHeightRef = useRef(drawerHeight); // 현재 높이 저장

  // open animation 의 target. props 에만 의존 → drawerHeight 가 흔들려도 변하지 않음.
  const openTargetY = isDrawerUp ? 0 : maxHeight - DRAWER_MIN_HEIGHT;

  // transform 의 단일 source. 첫 paint 는 peeking(103px) 위치에서 시작.
  const y = useMotionValue(maxHeight - DRAWER_MIN_HEIGHT);

  // 마운트(또는 isDrawerUp/maxHeight 변경)될 때만 imperative animate 한 번.
  // 부모 rerender, setDrawerHeight, 드래그가 일어나도 이 effect 는 다시 트리거되지 않음.
  useEffect(() => {
    const controls = animate(y, openTargetY, {
      type: "tween",
      ease: "easeOut",
      duration: 0.28,
    });
    return () => controls.stop();
  }, [openTargetY, y]);

  useEffect(() => {
    if (isDrawerUp) setDrawerHeight(maxHeight);
    else setDrawerHeight(DRAWER_MIN_HEIGHT);
  }, [isDrawerUp, maxHeight]);

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const handlePointerDown = (event) => {
    // 🔥 여기는 모달을 "닫으면 안 됨"
    const clientY = event.clientY ?? event.touches?.[0]?.clientY;
    startYRef.current = clientY;
    currentHeightRef.current = drawerHeight;

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = (event) => {
    const clientY = event.clientY ?? event.touches?.[0]?.clientY;
    const deltaY = startYRef.current - clientY;
    let newHeight = currentHeightRef.current + deltaY;

    // 드래그 범위는 "현재 높이 ± MAX_DRAG_DISTANCE"가 아니라
    // 최소/최대 높이 기준으로 제한하는 게 더 자연스럽기도 함
    newHeight = Math.max(DRAWER_MIN_HEIGHT, Math.min(newHeight, maxHeight));

    setDrawerHeight(newHeight);
    // 드래그는 transform 을 즉시 직접 갱신. open animation 과 독립적으로 동작.
    y.set(maxHeight - newHeight);
  };

  const handlePointerUp = (event) => {
    const clientY = event.clientY ?? event.touches?.[0]?.clientY;
    const deltaY = startYRef.current - clientY;

    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);

    // 위로 잘 올렸으면 풀오픈
    if (deltaY > SWIPE_THRESHOLD) {
      setDrawerHeight(maxHeight);
      animate(y, 0, { type: "tween", ease: "easeOut", duration: 0.2 });
      return;
    }

    // 아래로 충분히 내렸으면 닫기
    if (deltaY < -SWIPE_THRESHOLD) {
      setIsModal(false); // ← 진짜 닫는 건 여기서만
      setDrawerHeight(DRAWER_MIN_HEIGHT);
      return;
    }

    // 애매하면 원래 위치로 복원
    setDrawerHeight(currentHeightRef.current);
    animate(y, maxHeight - currentHeightRef.current, {
      type: "tween",
      ease: "easeOut",
      duration: 0.2,
    });
  };

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
          <Flex justify="center" py={3} w="full" cursor="grab" onPointerDown={handlePointerDown}>
            <TopNav />
          </Flex>
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
          <Box w="full" cursor="grab" onPointerDown={handlePointerDown}>
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
          {drawerHeight > 100 && children}
        </Flex>
        {drawerOptions?.footer && drawerHeight > 100 && (
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

const TopNav = styled.nav`
  width: 56px;
  height: 4px;

  border-radius: 4px;
  opacity: 0.4;
  background-color: var(--color-gray);
`;
