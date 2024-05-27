import { Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import styled from "styled-components";

import { IModal } from "../../../types/components/modalTypes";
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
}

export default function BottomDrawerLg({
  setIsModal,
  options,
  isAnimation = true,
  height = 397.5,
  children,
  isxpadding = true,
  isOverlay = true,
}: IBottomDrawerLg) {
  const header = options?.header;
  const footer = options?.footer;

  const handleDragEnd = (_, info) => {
    if (info.offset.y > 40) {
      setIsModal(false);
    }
  };

  return (
    <>
      {isOverlay && <ScreenOverlay onClick={() => setIsModal(false)} />}
      <Layout
        height={height}
        isxpadding={isxpadding.toString()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        initial={{ y: isAnimation ? height : 0 }}
        animate={{ y: 0 }}
        exit={{ y: height, transition: { duration: 0.2 } }}
        transition={{ duration: 0.4 }}
      >
        <TopNav />
        {header && (
          <Header>
            <span>{header.subTitle}</span>
            <span>{header.title}</span>
          </Header>
        )}
        {children}
        {footer && (
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

const Layout = styled(motion.div)<{ height: number; isxpadding: string }>`
  height: ${(props) => props.height}px;
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: var(--max-width);
  border-top-left-radius: var(--rounded-lg);
  border-top-right-radius: var(--rounded-lg);
  background-color: white;
  z-index: 5000;
  padding: ${(props) => (props.isxpadding === "true" ? "12px 20px" : "12px 0")};

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopNav = styled.nav`
  width: 56px;
  height: 4px;
  border-radius: 4px;
  background-color: var(--gray-400);
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
