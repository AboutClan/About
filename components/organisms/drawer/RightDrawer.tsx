import { Box, Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";

import Header from "../../layouts/Header";

interface RightUserDrawerProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  headerBtn?: React.ReactNode;
}

function RightDrawer({ title, onClose, children, headerBtn }: RightUserDrawerProps) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Drawer isOpen onClose={handleClose} size="full" placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody p="0" mx="auto" w="100%" maxW="var(--max-width)">
          <Header
            title={title}
            isSlide={false}
            func={onClose}
            rightPadding={headerBtn ? 4 : undefined}
          >
            {headerBtn}
          </Header>
          <Box px={5}>{children}</Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default RightDrawer;
