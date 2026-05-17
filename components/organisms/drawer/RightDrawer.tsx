import { Box, Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import Header from "../../layouts/Header";

interface RightUserDrawerProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  headerBtn?: React.ReactNode;
  px?: boolean;
  zIndex?: number;
  isOverlayClickable?: boolean;
  deferChildren?: boolean;
  isFull?: boolean;
}

function RightDrawer({
  title,
  onClose,
  children,
  headerBtn,
  px = true,
  zIndex = 3000,
  isOverlayClickable = false,
  deferChildren = true,
  isFull = true,
}: RightUserDrawerProps) {
  const [canRenderChildren, setCanRenderChildren] = useState(!deferChildren);

  useEffect(() => {
    if (!deferChildren) return;

    const frame = requestAnimationFrame(() => {
      setCanRenderChildren(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [deferChildren]);

  return (
    <Drawer
      isOpen
      onClose={onClose}
      size={isFull ? "full" : "xs"}
      placement="right"
      useInert={false}
      trapFocus={false}
      blockScrollOnMount={false}
    >
      <DrawerOverlay
        zIndex={zIndex}
        pointerEvents={isOverlayClickable ? "auto" : "none"}
        bg={isOverlayClickable ? "blackAlpha.600" : "transparent"}
      />

      <DrawerContent
        zIndex={zIndex + 1}
        pointerEvents="auto"
        w={isFull ? "100%" : "80%"}
        maxW={isFull ? "var(--max-width)" : "80%"}
        ml="auto"
      >
        <DrawerBody p="0" w="100%" sx={{ touchAction: "pan-y", overscrollBehavior: "contain" }}>
          <Header
            title={title}
            isSlide={false}
            func={onClose}
            rightPadding={headerBtn ? 4 : undefined}
          >
            {headerBtn}
          </Header>

          <Box px={px ? 5 : 0}>{canRenderChildren ? children : null}</Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default RightDrawer;
