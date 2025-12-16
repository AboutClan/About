import { Box, Button, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { IModal } from "../../../types/components/modalTypes";
import { iPhoneNotchSize } from "../../../utils/validationUtils";
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
  const [drawerHeight, setDrawerHeight] = useState(isDrawerUp ? maxHeight : DRAWER_MIN_HEIGHT); // 초기 높이
  const startYRef = useRef(0); // 드래그 시작 위치 저장
  const currentHeightRef = useRef(drawerHeight); // 현재 높이 저장

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
  };

  const handlePointerUp = (event) => {
    const clientY = event.clientY ?? event.touches?.[0]?.clientY;
    const deltaY = startYRef.current - clientY;

    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);

    // 위로 잘 올렸으면 풀오픈
    if (deltaY > SWIPE_THRESHOLD) {
      setDrawerHeight(maxHeight);
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
  };

  return (
    <>
      {isOverlay && <ScreenOverlay zIndex={zIndex} onClick={() => setIsModal(false)} />}
      <Layout
        ishide={isHideBottom ? "true" : "false"}
        zindex={zIndex}
        isdrawerup={isDrawerUp ? "true" : "false"}
        as={motion.div}
        initial={{ height: DRAWER_MIN_HEIGHT + iPhoneNotchSize() }}
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
          <Box py={2} w="100%" mt="auto" mb={`${iPhoneNotchSize()}px`}>
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
}>`
  position: fixed;
  overflow: hidden;
  bottom: ${(props) => (props.ishide === "true" ? 0 : 52)}px;
  width: 100%;
  max-width: var(--max-width);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;

  background-color: white;
  z-index: ${(props) => props.zindex || (props.ishide === "true" ? 700 : 500)};
  padding: 0 20px;
  padding-bottom: ${(props) => props.isdrawerup === "false" && "12px"};
  padding-top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopNav = styled.nav`
  width: 56px;
  height: 4px;

  border-radius: 4px;
  opacity: 0.4;
  background-color: var(--color-gray);
`;
