import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { iPhoneNotchSize } from "../../../utils/validationUtils";

export const DRAWER_MIN_HEIGHT = 40;
export const DRAWER_MAX_HEIGHT = 618; // 최대 높이

export default function BottomFlexDrawer({
  setIsModal,
  options,
  isAnimation = true,
  children,
  isxpadding = true,
  isOverlay = true,
  isLittleClose,
  isDrawerUp,
  paddingOptions,
}: any) {
  const header = options?.header;
  const footer = options?.footer;

  const [drawerHeight, setDrawerHeight] = useState(
    isDrawerUp ? DRAWER_MAX_HEIGHT : DRAWER_MIN_HEIGHT,
  ); // 초기 높이
  const startYRef = useRef(0); // 드래그 시작 위치 저장
  const currentHeightRef = useRef(drawerHeight); // 현재 높이 저장

  const SWIPE_THRESHOLD = 40; // 스와이프 임계값

  useEffect(() => {
    if (isDrawerUp) setDrawerHeight(DRAWER_MAX_HEIGHT);
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
    const deltaY = startYRef.current - currentY; // 드래그한 만큼의 변화량
    const newHeight = Math.max(currentHeightRef.current + deltaY, DRAWER_MIN_HEIGHT); // 최소 높이 설정
    setDrawerHeight(newHeight); // 드래그 중 높이 업데이트
  };

  const handlePointerUp = (event) => {
    const endY = event.clientY || event.touches[0].clientY;
    const deltaY = startYRef.current - endY; // 드래그한 만큼의 변화량

    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);

    if (deltaY > SWIPE_THRESHOLD) {
      setDrawerHeight(DRAWER_MAX_HEIGHT); // 위로 쭉 올라가는 동작
    } else if (deltaY < -SWIPE_THRESHOLD) {
      setDrawerHeight(DRAWER_MIN_HEIGHT); // 아래로 내려가는 동작
    } else {
      setDrawerHeight(currentHeightRef.current); // 스와이프가 임계값보다 짧으면 원래 높이로 복원
    }
  };

  return (
    <Layout
      isdrawerup={isDrawerUp}
      as={motion.div}
      animate={{ height: drawerHeight }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      isxpadding={isxpadding.toString()}
      paddingoptions={paddingOptions}
    >
      <Box py={3} cursor="grab" onPointerDown={handlePointerDown}>
        <TopNav />
      </Box>
      {drawerHeight > 100 && children}
    </Layout>
  );
}

const Layout = styled.div<{
  isdrawerup: boolean;
  paddingoptions: { bottom?: number };
  isxpadding: string;
}>`
  position: fixed;
  bottom: ${52 + iPhoneNotchSize()}px;
  width: 100%;
  max-width: var(--max-width);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: white;
  z-index: 500;
  padding: ${(props) => (props.isxpadding === "true" ? "12px 20px" : "12px 0")};
  padding-bottom: ${(props) => !props.isdrawerup && "12px"};
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
