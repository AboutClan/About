import { Box, Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";

import Header from "../../layouts/Header";

interface RightUserDrawerProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  headerBtn?: React.ReactNode;
  px?: boolean;
  zIndex?: number;
  isOverlayClickable?: boolean;
}

function RightDrawer({
  title,
  onClose,
  children,
  headerBtn,
  px = true,
  zIndex = 3000,
  isOverlayClickable = false,
}: RightUserDrawerProps) {
  return (
    <Drawer
      isOpen
      onClose={onClose}
      size="full"
      placement="right"
      portalProps={{
        containerRef: undefined,
      }}
    >
      <DrawerOverlay
        zIndex={zIndex}
        pointerEvents={isOverlayClickable ? "auto" : "none"}
        bg={isOverlayClickable ? "blackAlpha.600" : "transparent"}
      />

      <DrawerContent zIndex={zIndex + 1} pointerEvents="auto">
        <DrawerBody p="0" mx="auto" w="100%" maxW="var(--max-width)">
          <Header
            title={title}
            isSlide={false}
            func={onClose}
            rightPadding={headerBtn ? 4 : undefined}
          >
            {headerBtn}
          </Header>

          <Box px={px ? 5 : 0}>{children}</Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default RightDrawer;
