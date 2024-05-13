import { Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import styled from "styled-components";

import { IModal } from "../../../types/components/modalTypes";
import ScreenOverlay from "../../atoms/ScreenOverlay";

export interface IBottomDrawerLgOptions {
  header: {
    title: string;
    subTitle: string;
  };
  footer: {
    buttonText: string;
    onClick: () => void;
    buttonLoading?: boolean;
  };
}

interface IBottomDrawerLg extends IModal {
  options: IBottomDrawerLgOptions;
  children: React.ReactNode;
  isAnimation?: boolean;
}

const HEIGHT = 421.5;

export default function BottomDrawerLg({
  setIsModal,
  options: {
    header: { title, subTitle },
    footer: { buttonText, onClick, buttonLoading = false },
  },
  isAnimation = true,
  children,
}: IBottomDrawerLg) {
  const handleDragEnd = (_, info) => {
    if (info.offset.y > 40) {
      setIsModal(false);
    }
  };

  return (
    <>
      <ScreenOverlay onClick={() => setIsModal(false)} />
      <Layout
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        initial={{ y: isAnimation ? HEIGHT : 0 }}
        animate={{ y: 0 }}
        exit={{ y: HEIGHT, transition: { duration: 0.2 } }}
        transition={{ duration: 0.4 }}
      >
        <TopNav />
        <Header>
          <span>{subTitle}</span>
          <span>{title}</span>
        </Header>
        {children}
        <Button
          w="100%"
          mt="auto"
          colorScheme="mintTheme"
          size="lg"
          isLoading={buttonLoading}
          borderRadius="var(--rounded-lg)"
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </Layout>
    </>
  );
}

const Layout = styled(motion.div)`
  height: ${HEIGHT}px;
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: var(--max-width);
  border-top-left-radius: var(--rounded-lg);
  border-top-right-radius: var(--rounded-lg);
  background-color: white;
  z-index: 5000;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopNav = styled.nav`
  width: 56px;
  height: 4px;
  border-radius: 4px;
  background-color: var(--gray-400);
  margin-bottom: var(--gap-5);
`;

const Header = styled.header`
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  margin-bottom: var(--gap-5);
  > span:first-child {
    font-weight: 600;
    font-size: 15px;
    color: var(--gray-2);
    margin-bottom: var(--gap-1);
  }
  > span:last-child {
    font-size: 20px;
    font-weight: 600;
    color: var(--gray-900);
  }
`;
