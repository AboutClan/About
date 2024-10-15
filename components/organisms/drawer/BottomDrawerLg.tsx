import { Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { IModal } from "../../../types/components/modalTypes";
import { iPhoneNotchSize } from "../../../utils/validationUtils";
import ScreenOverlay from "../../atoms/ScreenOverlay";

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
  zIndex?: number;
  paddingOptions?: {
    bottom?: number;
  };
}

export default function BottomDrawerLg({
  setIsModal,
  options,
  isAnimation = true,
  height = 403.5,
  children,
  isxpadding = true,
  isOverlay = true,
  isLittleClose,
  zIndex,
  paddingOptions,
}: IBottomDrawerLg) {
  const header = options?.header;
  const footer = options?.footer;

  const [drawerHeight, setDrawerHeight] = useState(height);

  useEffect(() => {
    setDrawerHeight(height);
  }, [height]);

  const handleDragEnd = (_, info) => {
    if (info.offset.y > 40) {
      if (isLittleClose) setDrawerHeight(60);
      setIsModal(false);
    }
    if (info.offset.y < -40 && isLittleClose) {
      setDrawerHeight(height);
      setIsModal(true);
    }
  };

  return (
    <>
      {isOverlay && <ScreenOverlay onClick={() => setIsModal(false)} />}
      <Layout
        height={drawerHeight}
        zIndex={zIndex}
        isxpadding={isxpadding.toString()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        initial={{ y: isAnimation ? drawerHeight : 0 }}
        animate={{ y: 0 }}
        exit={{ y: drawerHeight, transition: { duration: 0.2 } }}
        transition={{ duration: 0.4 }}
        paddingoptions={paddingOptions}
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
            onClick={footer.onClick}
          >
            {footer.buttonText}
          </Button>
        )}
      </Layout>
    </>
  );
}

const Layout = styled(motion.div)<{
  zIndex?: number;
  paddingoptions: { bottom?: number };
  height: number;
  isxpadding: string;
}>`
  height: ${(props) => props.height + iPhoneNotchSize()}px;
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: var(--max-width);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: white;
  z-index: ${(props) => props.zIndex || 501};
  padding: ${(props) => (props.isxpadding === "true" ? "12px 20px" : "12px 0")};
  padding-bottom: ${(props) =>
    props.isxpadding === "true" && props?.paddingoptions?.bottom !== 0
      ? `${8 + iPhoneNotchSize()}px`
      : iPhoneNotchSize()};
  touch-action: none; /* 터치 스크롤을 막음 */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopNav = styled.nav`
  width: 60px;
  height: 4px;
  border-radius: 100px;
  background-color: var(--gray-500);
  opacity: 0.4;
  margin-bottom: 12px;
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
