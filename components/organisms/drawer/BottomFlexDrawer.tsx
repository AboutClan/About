import { Box, Button, Flex } from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import styled from "styled-components";

import { IModal } from "../../../types/components/modalTypes";
import { iPhoneNotchSize } from "../../../utils/validationUtils";
import ScreenOverlay from "../../atoms/ScreenOverlay";

export const DRAWER_MIN_HEIGHT = 103;

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
  height: heightProps,
  zIndex,
  isOverlay,
}: BottomFlexDrawerProps) {
  const drawerAnimation = useAnimation();
  const height = heightProps + iPhoneNotchSize();

  useEffect(() => {
    drawerAnimation.start(isDrawerUp ? "active" : "inActive");
  }, [isDrawerUp, drawerAnimation]);

  const contentStyles = {
    active: {
      y: 0,
    },
    inActive: {
      y: height - DRAWER_MIN_HEIGHT,
    },
  };

  return (
    <>
      {isOverlay && <ScreenOverlay zIndex={zIndex} onClick={() => setIsModal(false)} />}
      <Layout
        ishide={isHideBottom ? "true" : "false"}
        zindex={zIndex}
        isdrawerup={isDrawerUp ? "true" : "false"}
        as={motion.div}
        animate={drawerAnimation}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        drag="y"
        dragConstraints={{
          top: 0,
          bottom: height,
        }}
        dragDirectionLock
        dragMomentum={false}
        onDragEnd={(event, info) => {
          const isDraggingUp = info.offset.y < 0;
          const multiplier = 1 / 4;
          const threshold = height * multiplier;
          const isCorrectDirection = (isDraggingUp && !isDrawerUp) || (!isDraggingUp && isDrawerUp);

          if (isCorrectDirection && Math.abs(info.offset.y) > threshold) {
            setIsModal((prev) => !prev);
          } else {
            drawerAnimation.start(isDrawerUp ? "active" : "inActive");
          }
        }}
        variants={contentStyles}
      >
        <Flex justify="center" py={3} w="full" cursor="grab">
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
        <>{children}</>
        {drawerOptions?.footer && (
          <Box py={2} w="100%" mt="auto">
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
