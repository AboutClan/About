import { Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import styled from "styled-components";
import { IModal } from "../../../types/components/modalTypes";
import { iPhoneNotchSize } from "../../../utils/validationUtils";

export interface IBottomDrawerLgOptions {
  header?: {
    title: string;
    subTitle: string;
  };
  footer?: {
    buttonText: string;
    onClick: () => void;
    buttonLoading?: boolean;
  };
}

interface IBottomDrawerLg extends IModal {
  options?: IBottomDrawerLgOptions;
  children: React.ReactNode;
  isAnimation?: boolean;
  height?: number;
  isxpadding?: boolean;
  isOverlay?: boolean;
  isLittleClose?: boolean;
  paddingOptions?: {
    bottom?: number;
  };
}

export default function BottomFlexDrawer({
  setIsModal,
  options,
  isAnimation = true,
  height = 403.5,
  children,
  isxpadding = true,
  isOverlay = true,
  isLittleClose,
  paddingOptions,
}: IBottomDrawerLg) {
  const header = options?.header;
  const footer = options?.footer;

  const [drawerHeight, setDrawerHeight] = useState(height); // 초기 높이
  const startYRef = useRef(0); // 드래그 시작 위치 저장
  const currentHeightRef = useRef(drawerHeight); // 현재 높이 저장

  const handlePointerDown = (event) => {
    startYRef.current = event.clientY || event.touches[0].clientY; // 드래그 시작 위치 저장
    currentHeightRef.current = drawerHeight; // 드래그 시작 시점의 높이 저장
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = (event) => {
    const currentY = event.clientY || event.touches[0].clientY;
    const deltaY = startYRef.current - currentY; // 드래그한 만큼의 변화량

    const newHeight = Math.max(currentHeightRef.current + deltaY, 60); // 최소 높이 60 설정
    setDrawerHeight(newHeight); // 높이 업데이트
  };

  const handlePointerUp = () => {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);

    // 드래그 종료 후 닫기 조건 확인
    if (drawerHeight < 100 && isLittleClose) {
      setDrawerHeight(60); // 최소 높이로 설정
      setIsModal(false);
    }
  };

  return (
    <>
      <Layout
        as={motion.div}
        height={drawerHeight}
        isxpadding={isxpadding.toString()}
        paddingoptions={paddingOptions}
        onPointerDown={handlePointerDown} // 드래그 시작 시
      >
        <TopNav />

        {header && drawerHeight > 100 && (
          <Header>
            <span>{header.subTitle}</span>
            <span>{header.title}</span>
          </Header>
        )}
        {drawerHeight > 100 && children}
        {footer && drawerHeight > 100 && (
          <Button
            w="100%"
            mt="auto"
            colorScheme="mintTheme"
            size="lg"
            isLoading={footer.buttonLoading}
            borderRadius="var(--rounded-lg)"
            onClick={footer.onClick}
          >
            {footer.buttonText}
          </Button>
        )}
      </Layout>
    </>
  );
}

const Layout = styled.div<{
  paddingoptions: { bottom?: number };
  height: number;
  isxpadding: string;
}>`
  height: ${(props) => props.height + iPhoneNotchSize()}px;
  position: fixed;
  bottom: 100px;
  width: 100%;
  max-width: var(--max-width);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: white;
  z-index: 500;
  padding: ${(props) => (props.isxpadding === "true" ? "12px 20px" : "12px 0")};
  padding-bottom: ${(props) =>
    props.isxpadding === "true" && props?.paddingoptions?.bottom !== 0
      ? `${20 + iPhoneNotchSize()}px`
      : iPhoneNotchSize()};
  display: flex;
  flex-direction: column;
  align-items: center;
  touch-action: none; /* 터치 스크롤을 막음 */
`;

const TopNav = styled.nav`
  width: 56px;
  height: 4px;
  border-radius: 4px;
  background-color: var(--gray-400);
  margin-bottom: 16px;
`;

const Header = styled.header`
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  margin-bottom: var(--gap-5);
  > span:first-child {
    font-weight: 600;
    font-size: 15px;
    margin-bottom: var(--gap-1);
  }
  > span:last-child {
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-800);
  }
`;
