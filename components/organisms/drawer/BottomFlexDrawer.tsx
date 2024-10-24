import { Box, Button, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { IModal } from "../../../types/components/modalTypes";
import { iPhoneNotchSize } from "../../../utils/validationUtils";
import ScreenOverlay from "../../atoms/ScreenOverlay";

export const DRAWER_MIN_HEIGHT = 40;
//적당한 값 조율해야 함
export const MAX_DRAG_DISTANCE = 40;

const SWIPE_THRESHOLD = 40; // 스와이프 임계값

export interface BottomFlexDrawerOptions {
  header?: {
    title: string;
    subTitle: string;
  };
  footer?: {
    text: string;
    func: () => void;
    loading?: boolean;
  };
}

interface BottomFlexDrawerProps extends IModal {
  isHideBottom?: boolean;

  children: React.ReactNode;
  isDrawerUp: boolean;
  height: number;
  zIndex?: number;
  drawerOptions?: BottomFlexDrawerOptions;
  isOverlay: boolean;
}

export default function BottomFlexDrawer({
  setIsModal,
  isHideBottom,
  drawerOptions,
  children,
  isDrawerUp,
  height: maxHeight,
  zIndex,

  isOverlay,
}: BottomFlexDrawerProps) {
  console.log(42, isDrawerUp);
  const [drawerHeight, setDrawerHeight] = useState(isDrawerUp ? maxHeight : DRAWER_MIN_HEIGHT); // 초기 높이
  const startYRef = useRef(0); // 드래그 시작 위치 저장
  const currentHeightRef = useRef(drawerHeight); // 현재 높이 저장

  useEffect(() => {
    if (isDrawerUp) setDrawerHeight(maxHeight);
    else setDrawerHeight(DRAWER_MIN_HEIGHT);
  }, [isDrawerUp]);

  const handlePointerDown = (event) => {
    startYRef.current = event.clientY || event.touches[0].clientY; // 드래그 시작 위치 저장
    currentHeightRef.current = drawerHeight; // 드래그 시작 시점의 높이 저장
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = (event) => {
    const currentY = event.clientY || event.touches[0].clientY;
    const deltaY = startYRef.current - currentY;
    let newHeight = currentHeightRef.current + deltaY;

    // 최대 드래그 범위를 40px로 제한
    const maxDragHeight = currentHeightRef.current + MAX_DRAG_DISTANCE;
    const minDragHeight = currentHeightRef.current - MAX_DRAG_DISTANCE;
    newHeight = Math.max(Math.min(newHeight, maxDragHeight), minDragHeight);

    setDrawerHeight(newHeight);
  };

  const handlePointerUp = (event) => {
    const endY = event.clientY || event.touches[0].clientY;
    const deltaY = startYRef.current - endY; // 드래그한 만큼의 변화량

    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);

    if (deltaY > SWIPE_THRESHOLD) {
      setDrawerHeight(maxHeight); // 위로 쭉 올라가는 동작
    } else if (deltaY < -SWIPE_THRESHOLD) {
      setIsModal(false);

      setDrawerHeight(DRAWER_MIN_HEIGHT); // 아래로 내려가는 동작
    } else {
      setDrawerHeight(currentHeightRef.current); // 스와이프가 임계값보다 짧으면 원래 높이로 복원
    }
  };

  return (
    <>
      {isOverlay && <ScreenOverlay zIndex={zIndex} onClick={() => setIsModal(false)} />}
      <Layout
        ishide={isHideBottom ? "true" : "false"}
        zindex={zIndex}
        isdrawerup={isDrawerUp ? "true" : "false"}
        as={motion.div}
        animate={{ height: drawerHeight + iPhoneNotchSize() }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Flex justify="center" py={3} w="full" cursor="grab" onPointerDown={handlePointerDown}>
          <TopNav />
        </Flex>
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
        {drawerHeight > 100 && children}
        {drawerOptions?.footer && drawerHeight > 100 && (
          <Box py={2} w="100%">
            <Button
              w="100%"
              mt="auto"
              colorScheme="mintTheme"
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
}>`
  position: fixed;
  overflow: hidden;
  bottom: ${(props) => (props.ishide === "true" ? 0 : 52)}px;
  width: 100%;
  max-width: var(--max-width);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;

  background-color: white;
  z-index: ${(props) => props.zindex || (props.ishide ? 700 : 500)};
  padding: 0 20px;
  padding-bottom: ${(props) => props.isdrawerup === "false" && "12px"};
  padding-top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  touch-action: none; /* 터치 스크롤을 막음 */
`;

const TopNav = styled.nav`
  width: 56px;
  height: 4px;

  border-radius: 4px;
  opacity: 0.4;
  background-color: var(--color-gray);
`;
